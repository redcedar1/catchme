from rest_framework.response import Response
from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework import generics, status
from rest_framework.viewsets import ViewSet
from rest_framework.views import APIView
from common.models import *
from common.serializers import *
from rest_framework.viewsets import ModelViewSet
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated


class UserViewSet(ModelViewSet): #url 설정 해야함
    #permission_classes = [IsAuthenticated]

    queryset = userInfo.objects.all()
    serializer_class = UserInfoSerializer
    @action(detail = True, methods = ['post'])#detail은 single object를 반환한다는 것
    def introduction(self, request, *args, **kwargs):
        user = request.user #인증된 사용자 객체면 request.user값 안에 model에서 참조하는 userinfo의 kid가 있다.
        kid = kwargs.get('pk')
        if user.kid != int(kid):#model에 저장된 kid와 요청하는 페이지의 kid가 같은지 확인
            
            return Response({"message": "허가되지 않은 접근입니다."}, status=status.HTTP_401_UNAUTHORIZED) 
        
        data = request.data.copy()
        
        user_serializer = self.get_serializer(instance=user, data=request.data, partial=True)
        if user_serializer.is_valid():
            
            user_serializer.save()

        if user.ismale == True:
            
            men_info_serializer = MenInfoSerializer(data = request.data)
            if men_info_serializer.is_valid():
                men_info_serializer.save()
                return Response(user_serializer.data, status=status.HTTP_201_CREATED)
        else:
            women_info_serializer = WomenInfoSerializer(data =data)
            if women_info_serializer.is_valid():
                women_info_serializer.save()
                return Response(user_serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(status = status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        kid = kwargs.get('pk')  # 'pk'는 URL에서 전달된 객체의 식별자
        kid = int(kid)
        userinfo = get_object_or_404(userInfo, kid=kid)
        serializer = UserInfoSerializer(userinfo)
        return Response(serializer.data)
    #여기에 action으로 수정해야함. w_crush_kid를 수정하는건 굉장히 partial한작업인데 update로 처리하고잇으므로
    def update(self, request,*args, **kwargs):
        #modal id를 부여해야함 -> 남자한테만 뜨는 모달창이기 때문
        kid = kwargs.get('pk')
        userinfo = get_object_or_404(userInfo, kid = kid)
        
        if userinfo.ismale:
            user = userinfo.man_userInfo.get()
            w_crush_kid_data = request.data.get("w_crush_kid")

            crush_userInfo = get_object_or_404(userInfo,kid=w_crush_kid_data)
            user.w_crush = crush_userInfo.woman_userInfo.get()

            user.save()
        else:
            pass
        return Response({"message": "w_crush가 업데이트되었습니다."}, status=status.HTTP_200_OK)
    @action(detail = True, methods = ['post'])
    def join_party(self, request,**kwargs):#나중에 kwargs가 아니라 request.user 이런식으로 더 안전하게 정보 가져오기
        #userinfo = get_object_or_404(userInfo, kid=request.user.kid) 이렇게
        kid = kwargs.get('pk')
        userinfo = get_object_or_404(userInfo, kid = kid)
        
        if userinfo.ismale:

            user = userinfo.man_userInfo.get()

            data = request.data.copy()
            data['leader_man'] = user.id

            serializer = MenPartySerializer(data = data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            user = userinfo.woman_userInfo.get()

            data = request.data.copy()
            data['leader_woman'] = user.id

            serializer = WomenPartySerializer(data = data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    @action(detail=True, methods=['delete'])
    def delete_party(self, request,**kwargs):
        kid = kwargs.get('pk')
        ids_to_delete = request.data.get('ids', [])
        userinfo = get_object_or_404(userInfo, kid = kid)

        if userinfo.ismale:
            user = userinfo.man_userInfo.get()
            menParty.objects.filter(leader_man=user, id__in=ids_to_delete).delete()
            return Response({"message": "친구가 삭제되었습니다."}, status=status.HTTP_200_OK)
        else:
            user = userinfo.woman_userInfo.get()
            womenParty.objects.filter(leader_woman=user, id__in=ids_to_delete).delete()
            return Response({"message": "친구가 삭제되었습니다."}, status=status.HTTP_200_OK)


class UserNoticeView(APIView):
    #permission_classes = [IsAuthenticated]
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

class UserMatchingHistoryView(APIView):
    #permission_classes = [IsAuthenticated]
    def get(self, request, kid):
        kid = int(kid)
        userinfo = get_object_or_404(userInfo, kid = kid)
        serializer = UserMatchingHistorySerializer(userinfo)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self,request,kid,*args, **kwargs):
        kid = int(kid)
        ids_to_delete = request.data.get('ids', [])
        if not ids_to_delete:
            return Response({"error": "IDs 리스트가 제공되지 않았습니다."}, status=status.HTTP_400_BAD_REQUEST)
        notices = matchingHistory.objects.filter(id__in=ids_to_delete)
        notices.delete()
        return Response({"message": "매칭기록이이 삭제되었습니다."}, status=status.HTTP_200_OK)