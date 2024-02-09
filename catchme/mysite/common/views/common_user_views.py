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

class UserNoticeView(generics.ListAPIView):
    def get(self, request, kid):
        kid = int(kid)
        userinfo = get_object_or_404(userInfo, kid = kid)
        serializer = UserNoticeSerializer(userinfo)
        return Response(serializer.data, status=status.HTTP_200_OK)