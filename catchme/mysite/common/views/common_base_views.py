from django.shortcuts import render,redirect
from django.http import HttpResponse
import requests
from ..models import *
# Create your views here.

def index(request):
    print(request.session['location'])
    
    return render(request, "common/index.html")

def introduction(request):
    if request.method == "POST":
        gender = request.POST.get('gender')
        location = request.POST.get('location')
        
        user = userInfo(location = location, kid = "1250812")
        user.save()
        if gender =="male":
            man = menInfo(nickname = "james",user_info = user)
            man.save()
        else:
            woman = womenInfo(nickname = "julia",user_info = user)
            woman.save()        
        return redirect('common:index')
    else:
        return render(request, "common/introduction.html")



def kakaoLoginLogic(request):
    access_token = request.session.get("access_token",None)
    if access_token == None:
        _restApiKey = '5e0af453ab97a10d3d73f26da031db2a'
        _redirectUrl = 'http://127.0.0.1:8000/main/kakaoLoginLogicRedirect'
        _url = f'https://kauth.kakao.com/oauth/authorize?client_id={_restApiKey}&redirect_uri={_redirectUrl}&response_type=code'
        return redirect(_url)#카카오 서버로 접속하는것 여기로 접속하면 redirect uri로 정보를 쏴줌
    else:
        return HttpResponse("이미 로그인 되어 있습니다.")

def kakaoLoginLogicRedirect(request):
    _qs = request.GET['code']
    _restApiKey = '5e0af453ab97a10d3d73f26da031db2a' 
    _redirect_uri = 'http://127.0.0.1:8000/main/kakaoLoginLogicRedirect'
    _url = f'https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={_restApiKey}&redirect_uri={_redirect_uri}&code={_qs}'
    _res = requests.post(_url) # post형식으로 온 정보를
    _result = _res.json() #json화 한 후
    request.session['access_token'] = _result['access_token']#access token만 세션에 저장
    request.session.modified = True
    
    return redirect("common:introduction") #로그인 완료 후엔 home페이지로

def kakaoLogout(request):
    access_token = request.session.get("access_token",None)
    if access_token == None: #로그인 안돼있으면
        return redirect("common:login") #무지성 로그아웃 누른애는 로그인하도록 로그인창으로 보내기

    else:
        del request.session['access_token']
        return HttpResponse("로그아웃 성공")
