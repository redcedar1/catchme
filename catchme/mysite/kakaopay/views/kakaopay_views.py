from django.shortcuts import render, redirect
import requests
from common.models import userInfo, payment

# Create your views here.

def index(request):
    return render(request, "kakaopay/index.html")

def kakaoPaylogic(request):
<<<<<<< HEAD
    kakao_id = 0
=======
    kakao_id = 0 #테스트용, 실제로는 access_token을 이용해 카톡 고유 번호 10자리를 받아야함
>>>>>>> origin/back
    user_info = userInfo.objects.get(kid=kakao_id)

    URL = 'https://kapi.kakao.com/v1/payment/ready'
    headers = {
        "Authorization": "KakaoAK " + "9f56720bbd72f449281423c4702be048",
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    }
    params = {
        "cid": "TC0ONETIME",# 가맹점 코드
        "partner_order_id": "0",# 주문 번호
        "partner_user_id": str(user_info.kid),# 사용자 아이디
        "item_name": "catchme",# 상품 이름
        "quantity": "1",# 상품 개수
        "total_amount": "5000",# 가격
        "tax_free_amount": "0",# 상품 비과세
<<<<<<< HEAD
        "approval_url": "ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/kakaopay/approval",
        "cancel_url": "ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080",
        "fail_url": "ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080",
=======
        "approval_url": "http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080/kakaopay/approval",
        "cancel_url": "http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080",
        "fail_url": "http://ec2-54-180-83-160.ap-northeast-2.compute.amazonaws.com:8080",
>>>>>>> origin/back
    }

    res = requests.post(URL, headers=headers, params=params)
    request.session['tid'] = res.json()['tid']# 결제 승인시 사용할 tid를 세션에 저장
    next_url = res.json()['next_redirect_pc_url']# 클라이언트가 PC웹일 경우
    #next_url = res.json()['next_redirect_mobile_url']# 클라리언트가 모바일 웹일 경우
    #next_url = res.json()['next_redirect_app_url']# 클라이언트가 모바일 앱일 경우
    return redirect(next_url)

def approval(request):
    kakao_id = 0
    user_info = userInfo.objects.get(kid=kakao_id)

    URL = 'https://kapi.kakao.com/v1/payment/approve'
    headers = {
        "Authorization": "KakaoAK " + "9f56720bbd72f449281423c4702be048",
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    }
    params = {
        "cid": "TC0ONETIME",
        "tid": request.session['tid'],
        "partner_order_id": "0",
        "partner_user_id": str(user_info.kid),
        "pg_token": request.GET.get("pg_token"),
    }

    payment_record = payment.objects.create(
        tid=request.session['tid'],
        pay_user=user_info
    )

    res = requests.post(URL, headers=headers, params=params)
    print(res.json())
    amount = res.json().get('amount', {}).get('total')
    print('Amount:', amount)
    res = res.json()
    context = {
        'res': res,
        'amount': amount,
    }
    return render(request, "kakaopay/approval.html", context)