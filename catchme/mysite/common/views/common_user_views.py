from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.viewsets import ViewSet
from rest_framework.views import APIView
from common.models import *
from common.serializers import *
from rest_framework.viewsets import ModelViewSet

class UserViewSet(ModelViewSet): #url 설정 해야함

    queryset = userInfo.objects.all()
    serializer_class = UserInfoSerializer

    def retrieve(self, request, *args, **kwargs):
        kid = kwargs.get('pk')  # 'pk'는 URL에서 전달된 객체의 식별자
        kid = int(kid)
        userinfo = get_object_or_404(userInfo, kid=kid)
        serializer = UserInfoSerializer(userinfo)
        return Response(serializer.data)
    
    def update(self, request,*args, **kwargs):
        #modal id를 부여해야함 -> 남자한테만 뜨는 모달창이기 때문
        kid = kwargs.get('pk')
        userinfo = get_object_or_404(userInfo,kid = kid)

        if userinfo.ismale:
            user = userinfo.man_userInfo.get()
            w_crush_kid_data = request.data.get("w_crush_kid")

            crush_userInfo = get_object_or_404(userInfo,kid=w_crush_kid_data)
            user.w_crush = crush_userInfo.woman_userInfo.get()

            user.save()
        else:
            pass
        return Response({"message": "w_crush가 업데이트되었습니다."}, status=status.HTTP_200_OK)


class UserNoticeView(generics.ListAPIView):
    def get(self, request, kid):
        kid = int(kid)
        userinfo = get_object_or_404(userInfo, kid = kid)
        serializer = UserNoticeSerializer(userinfo)
        return Response(serializer.data, status=status.HTTP_200_OK)