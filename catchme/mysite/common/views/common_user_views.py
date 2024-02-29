from rest_framework.response import Response
from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework import generics, status
from rest_framework.viewsets import ViewSet
from rest_framework.views import APIView
from common.models import *
from common.serializers import *
from rest_framework.viewsets import ModelViewSet
from django.views.decorators.csrf import csrf_exempt

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


class UserNoticeView(APIView):
    def get(self, request, kid):
        kid = int(kid)
        userinfo = get_object_or_404(userInfo, kid = kid)
        serializer = UserNoticeSerializer(userinfo)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self,request,kid,*args, **kwargs):
        kid = int(kid)
        ids_to_delete = request.data.get('ids', [])
        if not ids_to_delete:
            return Response({"error": "IDs 리스트가 제공되지 않았습니다."}, status=status.HTTP_400_BAD_REQUEST)
        notices = Notice.objects.filter(id__in=ids_to_delete)
        notices.delete()
        return Response({"message": "알림이 삭제되었습니다."}, status=status.HTTP_200_OK)
    
    def put(self, request, kid, *args, **kwargs):
        kid = int(kid)
        ids_to_update = request.data.get('ids', [])
        if not ids_to_update:
            return Response({"error": "IDs 리스트가 제공되지 않았습니다."}, status=status.HTTP_400_BAD_REQUEST)

        notices = Notice.objects.filter(id__in=ids_to_update)
        updated_count = notices.update(readed=True)

        return Response({"message": f"{updated_count}개의 알림이 업데이트되었습니다."}, status=status.HTTP_200_OK)

