

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render,redirect,get_object_or_404
from django.http import HttpResponse
from common.models import room, menInfo, womenInfo
from ..serializers import RoomSerializer
import requests


def index(request):
    return render(request,"room/room.html")

def selectedRoom(request,r_no):
    context = {"r_no":r_no}
    return render(request,"room/selected_room.html",context)


#API views
class RoomListView(generics.ListAPIView):
    queryset = room.objects.all().prefetch_related('men_infos', 'women_infos') #prefetch는 관련된 모델 효율적으로 로드하는 메서드
                                #prefetched_related에 들어가는 parameter은 model의 related_name을 반영
                                #prefetched_related는 쿼리의 효율성을 따지는 것이지 어떤 속성을 불러올것인지를
                                #정의하는것은 아님 따라서 어떤속성이 불러와질것인지는 RoomSerializer이 정함
    #queryset = room.objects.filter(readynum=4).prefetch_related('men_infos', 'women_infos') #readynum이 4인 객체들만 직렬화
    serializer_class = RoomSerializer

class SelectedRoomView(APIView):
    def get(self, request, r_no):
        selected_room = get_object_or_404(room, rno = r_no)
        serializer = RoomSerializer(selected_room)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
