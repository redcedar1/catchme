from django.shortcuts import get_object_or_404, render,redirect
from django.http import HttpResponse, JsonResponse
from rest_framework.response import Response
from ..serializers import UserInfoSerializer
from ..models import *
from django.middleware.csrf import get_token
import requests
from django.contrib.auth.decorators import login_required
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
# Create your views here.




def index(request):
    
    return HttpResponse("반갑습니다 캐치미의 api 서버입니다 - 태일,기정-")

@login_required(login_url='common:kakaoLoginLogic')
def introduction(request):
    access_token = request.session.get("access_token",None)
    if access_token == None: #로그인이 안되어있으면 로그인 시킨다.
        return redirect("common:kakaoLoginLogic")
    else:#로그인이 되어 있을 때
        if request.method == "POST": #페이지에 자기소개 정보를 post로 전송시
            account_info = requests.get("https://kapi.kakao.com/v2/user/me",
                                    headers={"Authorization": f"Bearer {access_token}"}).json() #사용자 정보를 json 형태로 받아옴
            kid = account_info.get("id")#유저 고유 식별 번호
            request.session['kid'] = kid # 유저의 kid를 세션에 저장하여 세션접근하여 유저 확인
            gender = request.POST.get('gender')
            location = request.POST.get('location')
            nickname = request.POST.get('nickname')
            user = userInfo(location = location, kid = kid)
            user.save()
            if gender =="male":
                man = menInfo(nickname = nickname, user = user)
                man.save()
            else:
                woman = womenInfo(nickname = nickname, user = user)
                woman.save()
            return redirect('common:index')
        else:#페이지 요청이면 자기소개 페이지로
            return render(request, "common/introduction.html")

class kakaoLoginView(APIView):
    def post(self, request):
        try:
            code = request.data.get("code") # 프론트에서 보내준 code로 token을 구해와야한다 !! 
            print(code)
            access_token = requests.post(
                "https://kauth.kakao.com/oauth/token",
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data={
                    "grant_type": "authorization_code",
                    "client_id": "273e3f916e59df62a965cb94d235f29e",
                    "redirect_uri": "https://catchme-smoky.vercel.app/login",
                    "code": code
                },
            )
            access_token = access_token.json().get("access_token")
            account_info = requests.get("https://kapi.kakao.com/v2/user/me",
                                headers={"Authorization": f"Bearer {access_token}"}).json()
            if not userInfo.objects.filter(kid = account_info['id']).exists():#db상에 kid가 없는 유저라면 introduction하라는 답변을 response, 있는 유저면 db조회 후 로그인 처리할지말지
                user = userInfo.objects.create(#db에 유저 생성 -> 이부분을 introduction과 연계해야함
                    kid = account_info['id'])
                user.save()
            else:
                user = userInfo.objects.get(kid = account_info['id'])

            refresh = RefreshToken.for_user(user)#refreshToken은 User모델을 상정하기 때문에 User모델 대신 userInfo모델을 전송
            tokens = {
                'kid' : user.kid,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response({'tokens': tokens}, status=status.HTTP_200_OK)
            
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)  


#카카오 로그인을 진행해야 카카오 서버의 보안과정을 거쳐서 백엔드 서버로 kid를 포함한 
#user정보를 전송 => user정보가 전송 되면 그 유저 정보를 토대로 jwt토큰 생성
#jwt토큰을 클라이언트에게 반환하면, 로그인 한 사용자에 해당하는 jwt토큰을 클라이언트에게 전송한 것이기 때문에
#클라이언트는 그 토큰을 로컬 스토리지에 저장해서 백엔드에 정보를 요청할때마다 토큰을 로컬스토리지에서 꺼내서 같이 요청
#로그인 안한 사용자는 서버가 jwt토큰을 발행해주지 않으므로, 사용자는 반드시 로그인을 해야함

@login_required(login_url='common:kakaoLoginLogic')
def kakaoLogout(request):
    access_token = request.session.get("access_token",None)
    if access_token == None: #로그인 안돼있으면
        return redirect("common:login") #무지성 로그아웃 누른애는 로그인하도록 로그인창으로 보내기

    else:
        del request.session['access_token']
        return HttpResponse("로그아웃 성공")

def csrf(request):
    csrf_token = get_token(request)
    return JsonResponse({"csrfToken": csrf_token})



###여기 아래는 jwt토큰 관련 테스트###
@api_view(['GET'])
def test_usercreate_view(request):
    user = userInfo.objects.create(#db에 유저 생성 -> 이부분을 introduction과 연계해야함,
                    kid = 12341234
                )
    refresh = RefreshToken.for_user(user)#refreshToken은 User모델을 상정하기 때문에 User모델 대신 userInfo모델을 전송
    tokens = {
        'kid' : user.kid,
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    return Response({'tokens': tokens}, status=status.HTTP_200_OK)

class TestJWTTokenView(APIView):
    # 인증된 사용자만 접근 가능하도록 권한 설정
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        # 사용자 정보를 딕셔너리 형태로 생성
        user_info = {
            "kid":user.kid
        }
        return Response({"user_info": user_info}, status=status.HTTP_200_OK)

class posttest(APIView):
    def post(self,request):
        return Response({"data" : request.data},status=status.HTTP_200_OK)