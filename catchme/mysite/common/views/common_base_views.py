from django.shortcuts import get_object_or_404, render,redirect
from django.http import HttpResponse, JsonResponse

from ..serializers import UserInfoSerializer
from ..models import *
from django.middleware.csrf import get_token
import requests
from django.contrib.auth.decorators import login_required
from rest_framework import generics, status
from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.

def index(request):
    
    return render(request,"index.html")

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

def kakaoLoginLogic(request):
    access_token = request.session.get("access_token",None) #어떻게 access_token을 받아올것인가.
    if True: #access_token을 사용하지 않으면 어떻게 카카오로그인 되어있는지 확인할것인가. jwt 토큰 확인하면 된다.
        _restApiKey = '5e0af453ab97a10d3d73f26da031db2a'
        _redirectUrl = 'http://ec2-54-180-82-92.ap-northeast-2.compute.amazonaws.com:8080/main/kakaoLoginLogicRedirect'
        _url = f'https://kauth.kakao.com/oauth/authorize?client_id={_restApiKey}&redirect_uri={_redirectUrl}&response_type=code'
        return JsonResponse({'_url':_url})#이 url로 접속하면 kakaoLoginLogicRedirect 로 카카오서버가 정보를 쏴주므로, 클라이언트에서 이링크로 redirect시켜주면됨 
    else:
        #이미 로그인 되어있으므로 로그인 되어있다는 것을 프론트에 알려줌
        #else부분 아직 코드 미완성
        return HttpResponse("이미 로그인 되어 있습니다.")

def kakaoLoginLogicRedirect(request):
    _qs = request.GET['code']
    _restApiKey = '5e0af453ab97a10d3d73f26da031db2a'
    _redirect_uri = 'http://ec2-54-180-82-92.ap-northeast-2.compute.amazonaws.com:8080/main/kakaoLoginLogicRedirect'
    _url = f'https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={_restApiKey}&redirect_uri={_redirect_uri}&code={_qs}'
    _res = requests.post(_url) # post형식으로 온 정보를
    _result = _res.json() #json화 한 후
    
    #_result에는
    #{"access_token": "4kTs7hAc4-mOdEVRogHgyYQhKXLy4EQ-F6sKPXLqAAABjZuZgbLMISgqRbFCUQ", "token_type": "bearer",
    #"refresh_token": "NGs7hKNqR6Ll7u1HNhVdShh0BxCimnhJfCgKPXLqAAABjZuZga_MISgqRbFCUQ", "expires_in": 21599, "refresh_token_expires_in": 5183999}
    #이런 정보들이 들어가있음

    #로그인 성공 후 access 토큰 저장 =>   _result['access_token']
    account_info = requests.get("https://kapi.kakao.com/v2/user/me",
                                headers={"Authorization": f"Bearer {_result['access_token']}"}).json()
    
    if not userInfo.objects.filter(kid = account_info['id']).exists():#db상에 kid가 없는 유저라면 introduction하라는 답변을 response, 있는 유저면 db조회 후 로그인 처리할지말지
        user = userInfo.objects.create(#db에 유저 생성 -> 이부분을 introduction과 연계해야함,
            kid = account_info['id'],
            location = "경기도 고양시",
            ismale = True
        )
        user.save()
    else:
        user = userInfo.objects.get(kid = account_info['id'])

    refresh = RefreshToken.for_user(user)
    tokens = {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    print(tokens)
    return JsonResponse({"user": UserInfoSerializer(user).data, "tokens": tokens})
    #return redirect("https://catchme-smoky.vercel.app/login")
#kid 를 통해서 사용자의 정보를 조회한후있는지 없는지 반환
#반환할때 jwt 같이 반환해서 kid에 해당하는 사용자가 로그인 되어있는 사용자라는 사실을 반환
        
        

    


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

