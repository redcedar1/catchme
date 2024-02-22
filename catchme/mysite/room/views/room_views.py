

import json
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render,redirect,get_object_or_404
from django.http import HttpResponse
from common.models import room, menInfo, womenInfo, userInfo
from ..serializers import RoomSerializer, SelectedRoomSerializer
from django.middleware.csrf import get_token
import requests
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return render(request,"room/room.html")


@csrf_exempt
def selectedRoom(request):
    if request.method == "POST":
        data = json.loads(request.body)  # JSON 데이터 파싱
        kid = data.get('kid')
        ready = data.get('ready')  # ready 값 가져오기

        selected_user = get_object_or_404(userInfo, kid=kid)
        men_info_instance = selected_user.meninfo_set.first()  # meninfo_set 사용
        if men_info_instance:
            men_info_instance.ready = not ready  # ready 값을 반전시키지 않고 직접 설정
            men_info_instance.save()
        return HttpResponse("post Ssip Ganeung?")

    return HttpResponse("Get SSap Ganeung")


def matchingRoom(request):
    return True


# API views
class RoomListView(generics.ListAPIView):
    queryset = room.objects.all()
    # queryset = room.objects.filter(readynum=4).prefetch_related('men_infos', 'women_infos') #readynum이 4인 객체들만 직렬화
    serializer_class = RoomSerializer


class SelectedRoomView(APIView):
    def get(self, request, r_no):
        selected_room = get_object_or_404(room, rno=r_no)
        serializer = SelectedRoomSerializer(selected_room)
        return Response(serializer.data, status=status.HTTP_200_OK)

# 이상형 조건에 부합하는 상위 방 5개 조회 가능한 클래스
class RoomListIdealView(APIView):
    def get(self, request, *args, **kwargs):
        user_id = 0
        user_info = userInfo.objects.get(kid=user_id)
        if user_info.ismale == True:
            return self.getMenIdealRoomList()
        elif user_info.ismale == False:
            return self.getWomenIdealRoomList()

    def getMenIdealRoomList(self):
        # 남성 사용자 정보 조회
        user_id = 0
        user_info = userInfo.objects.get(kid=user_id)
        men_info = user_info.man_userInfo.first()

        # 여성 유저 필터링 (이상형 조건에 부합하는 여성들)
        matching_women = womenInfo.objects.exclude(participate_room__isnull=True)
        start_age, end_age = map(int, men_info.w_age.split('-'))
        start_height, end_height = map(int, men_info.w_height.split('-'))
        jobs = men_info.w_job.split(',')
        schools = men_info.w_school.split(',')
        majors = men_info.w_major.split(',')
        mbtis = men_info.w_mbti.split(',')
        bodies = men_info.w_body.split(',')
        eyes = men_info.w_eyes.split(',')
        faces = men_info.w_face.split(',')
        hobbies = men_info.w_hobby.split(',')
        animals = men_info.w_animal.split(',')

        for woman in matching_women:
            matching_count = 0
            if matching_women.filter(age__range=(start_age, end_age), id=woman.id).exists():
                matching_count += 1
            if matching_women.filter(job__in=jobs, id=woman.id).exists():
                matching_count += 1
            if matching_women.filter(school__in=schools, id=woman.id).exists():
                matching_count += 1
            if matching_women.filter(major__in=majors, id=woman.id).exists():
                matching_count += 1
            if matching_women.filter(mbti__in=mbtis, id=woman.id).exists():
                matching_count += 1
            if matching_women.filter(height__range=(start_height, end_height), id=woman.id).exists():
                matching_count += 1
            if matching_women.filter(body__in=bodies, id=woman.id).exists():
                matching_count += 1
            if matching_women.filter(eyes__in=eyes, id=woman.id).exists():
                matching_count += 1
            if matching_women.filter(face__in=faces, id=woman.id).exists():
                matching_count += 1
            if matching_women.filter(hobby__in=hobbies, id=woman.id).exists():
                matching_count += 1
            if matching_women.filter(animal__in=animals, id=woman.id).exists():
                matching_count += 1

            woman.matching_count = matching_count

        # 매칭된 여성 유저들을 매칭 카운트 기준으로 정렬하여 상위 5개 방 조회
        matching_women = sorted(matching_women, key=lambda x: -x.matching_count)
        matching_rooms = []
        for woman in matching_women:
            if woman.participate_room.rno not in matching_rooms:
                matching_rooms.append(woman.participate_room.rno)
            if len(matching_rooms) == 5:
                break

        serializer = RoomSerializer(room.objects.filter(rno__in=matching_rooms), many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def getWomenIdealRoomList(self):
        # 여성 사용자 정보 조회
        user_id = 0
        user_info = userInfo.objects.get(kid=user_id)
        women_info = user_info.woman_userInfo.first()

        # 남성 유저 필터링 (이상형 조건에 부합하는 남성들)
        matching_men = menInfo.objects.exclude(participate_room__isnull=True)
        start_age, end_age = map(int, women_info.m_age.split('-'))
        start_height, end_height = map(int, women_info.m_height.split('-'))
        jobs = women_info.m_job.split(',')
        schools = women_info.m_school.split(',')
        majors = women_info.m_major.split(',')
        armies = women_info.m_army.split(',')
        mbtis = women_info.m_mbti.split(',')
        bodies = women_info.m_body.split(',')
        eyes = women_info.m_eyes.split(',')
        faces = women_info.m_face.split(',')
        hobbies = women_info.m_hobby.split(',')
        animals = women_info.m_animal.split(',')

        for man in matching_men:
            matching_count = 0
            if matching_men.filter(age__range=(start_age, end_age), id=man.id).exists():
                matching_count += 1
            if matching_men.filter(job__in=jobs, id=man.id).exists():
                matching_count += 1
            if matching_men.filter(school__in=schools, id=man.id).exists():
                matching_count += 1
            if matching_men.filter(major__in=majors, id=man.id).exists():
                matching_count += 1
            if matching_men.filter(army__in=armies, id=man.id).exists():
                matching_count += 1
            if matching_men.filter(mbti__in=mbtis, id=man.id).exists():
                matching_count += 1
            if matching_men.filter(height__range=(start_height, end_height), id=man.id).exists():
                matching_count += 1
            if matching_men.filter(body__in=bodies, id=man.id).exists():
                matching_count += 1
            if matching_men.filter(eyes__in=eyes, id=man.id).exists():
                matching_count += 1
            if matching_men.filter(face__in=faces, id=man.id).exists():
                matching_count += 1
            if matching_men.filter(hobby__in=hobbies, id=man.id).exists():
                matching_count += 1
            if matching_men.filter(animal__in=animals, id=man.id).exists():
                matching_count += 1

            man.matching_count = matching_count

        # 매칭된 남성 유저들을 매칭 카운트 기준으로 정렬하여 상위 5개 방 조회
        matching_men = sorted(matching_men, key=lambda x: -x.matching_count)
        matching_rooms = []
        for man in matching_men:
            if man.participate_room.rno not in matching_rooms:
                matching_rooms.append(man.participate_room.rno)
            if len(matching_rooms) == 5:
                break

        serializer = RoomSerializer(room.objects.filter(rno__in=matching_rooms), many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)