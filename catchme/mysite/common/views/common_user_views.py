from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import generics, status

from common.models import *
from common.serializers import *

class UserView(generics.ListAPIView):
    def get(self,request, kid):
        kid = int(kid)
        userinfo = get_object_or_404(userInfo, kid = kid)
        serializer = UserInfoSerializer(userinfo)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, kid):
        # POST 요청 처리 로직
        # 예를 들어, 요청 데이터를 검증하고 모델을 저장하는 로직
        kid = int(kid)
        userinfo = get_object_or_404(userInfo,kid = kid)
        w_crush_data = request.data.get("w_crush")
        if w_crush_data:
            # w_crush 속성 업데이트
            userinfo.w_crush = w_crush_data
            userinfo.save()
            return Response({"message": "w_crush가 업데이트되었습니다."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "w_crush 데이터가 제공되지 않았습니다."}, status=status.HTTP_400_BAD_REQUEST)

class UserNoticeView(generics.ListAPIView):
    def get(self, request, kid):
        kid = int(kid)
        userinfo = get_object_or_404(userInfo, kid = kid)
        serializer = UserNoticeSerializer(userinfo)
        return Response(serializer.data, status=status.HTTP_200_OK)