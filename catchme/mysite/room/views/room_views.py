from rest_framework import generics
from django.shortcuts import render,redirect
from django.http import HttpResponse
from common.models import room, menInfo, womenInfo
from ..serializers import RoomSerializer
import requests

class RoomInfoView(generics.ListAPIView):
    queryset = room.objects.all().prefetch_related('men_infos', 'women_infos') #prefetch는 관련된 모델 효율적으로 로드하는 메서드
                                                    #prefetched_related에 들어가는 parameter은 model의 related_name을 반영
    serializer_class = RoomSerializer

def index(request):
    return render(request,"room/room.html")