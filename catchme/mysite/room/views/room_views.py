

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render,redirect,get_object_or_404
from django.http import HttpResponse
from common.models import room, menInfo, womenInfo
from ..serializers import RoomSerializer
from django.middleware.csrf import get_token
import requests
from django.contrib.auth.decorators import login_required

def index(request):
    return render(request,"room/room.html")

@login_required(login_url='common:kakaoLoginLogic')
def selectedRoom(request,r_no):

    if request.method == "POST":
        return HttpResponse("FUCK YOU")
    
    context = {"r_no":r_no}
    

    return render(request, "room/selected_room.html", context)

def matchingRoom(request,r_no):
    return True

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
    
class RoomListIdealView(generics.ListAPIView):
    serializer_class = RoomSerializer

    def getMenIdealRoomList(self):
        # 남성 사용자 정보 조회
        kakao_id = 0
        user_info = menInfo.objects.get(mkid=kakao_id)

        # 여성 유저 필터링 (이상형 조건에 부합하는 여성들)
        matching_women = womenInfo.objects.exclude(rno__isnull=True)
        start_age, end_age = map(int, user_info.w_age.split('-'))
        start_height, end_height = map(int, user_info.w_height.split('-'))
        jobs = user_info.w_job(',')

        for woman in matching_women:
            matching_count = 0
            if matching_women.objects.filter(age__range=(start_age, end_age), wkid=woman.wkid).exists():
                matching_count += 1
            if matching_women.objects.filter(job__in=jobs, wkid=woman.wkid).exists():
                matching_count += 1
            if woman.school == user_info.w_school:
                matching_count += 1
            if woman.major == user_info.w_major:
                matching_count += 1
            if woman.mbti == user_info.w_mbti:
                matching_count += 1
            if matching_women.objects.filter(height__range=(start_height, end_height), wkid=woman.wkid).exists():
                matching_count += 1
            if woman.body == user_info.w_body:
                matching_count += 1
            if woman.eyes == user_info.w_eyes:
                matching_count += 1
            if woman.face == user_info.w_face:
                matching_count += 1
            if woman.hobby == user_info.w_hobby:
                matching_count += 1

            woman.matching_count = matching_count

        # 매칭된 여성 유저들을 매칭 카운트 기준으로 정렬하여 상위 5개 방 조회
        matching_women = sorted(matching_women, key=lambda x: -x.matching_count)
        matching_rooms = list(set(woman.rno for woman in matching_women[:5]))
        matching_rooms_int = [room.rno for room in matching_rooms]

        serializer = RoomSerializer(room.objects.filter(rno__in=matching_rooms_int), many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def getWomenIdealRoomList(self):
        # 여성 사용자 정보 조회
        kakao_id = 0
        user_info = womenInfo.objects.get(wkid=kakao_id)

        # 남성 유저 필터링 (이상형 조건에 부합하는 남성들)
        matching_men = menInfo.objects.exclude(rno__isnull=True)
        start_age, end_age = map(int, user_info.m_age.split('-'))
        start_height, end_height = map(int, user_info.m_height.split('-'))
        jobs = user_info.m_job(',')

        for man in matching_men:
            matching_count = 0
            if matching_men.objects.filter(age__range=(start_age, end_age), mkid=man.mkid).exists():
                matching_count += 1
            if matching_men.objects.filter(job__in=jobs, mkid=man.mkid).exists():
                matching_count += 1
            if man.school == user_info.m_school:
                matching_count += 1
            if man.major == user_info.m_major:
                matching_count += 1
            if man.mbti == user_info.m_major:
                matching_count += 1
            if man.army == user_info.m_army:
                matching_count += 1
            if matching_men.objects.filter(height__range=(start_height, end_height), mkid=man.mkid).exists():
                matching_count += 1
            if man.body == user_info.m_body:
                matching_count += 1
            if man.eyes == user_info.m_eyes:
                matching_count += 1
            if man.face == user_info.m_face:
                matching_count += 1
            if man.hobby == user_info.m_hobby:
                matching_count += 1

            man.matching_count = matching_count

        # 매칭된 남성 유저들을 매칭 카운트 기준으로 정렬하여 상위 5개 방 조회
        matching_men = sorted(matching_men, key=lambda x: -x.matching_count)
        matching_rooms = list(set(man.rno for man in matching_men[:5]))
        matching_rooms_int = [room.rno for room in matching_rooms]

        serializer = RoomSerializer(room.objects.filter(rno__in=matching_rooms_int), many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)