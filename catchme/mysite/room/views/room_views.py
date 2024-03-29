

import json
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render,redirect,get_object_or_404
from django.http import HttpResponse
from common.models import room, menInfo, womenInfo, userInfo
from ..serializers import RoomSerializer, SelectedRoomSerializer, PercentageSerializer, SecondRecommendationSerializer
from django.middleware.csrf import get_token
import requests
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.db.models import F, Q
from django.db.models import Count
from rest_framework.permissions import IsAuthenticated

class RoomListView(APIView):
    #permission_classes = [IsAuthenticated]
    queryset = room.objects.all()
    # queryset = room.objects.filter(readynum=4).prefetch_related('men_infos', 'women_infos') #readynum이 4인 객체들만 직렬화
    # 아니면 아래처럼 함수로 만들기
    serializer_class = RoomSerializer

    def get_queryset(self):
        kw = self.request.GET.get('kw', None)
        order = self.request.GET.get('order', None)
        location = self.request.GET.get('location', None)
        queryset = room.objects.all().exclude(matching=True)#matching중인 방 제외

        if kw :
            queryset = queryset.filter(Q(rname__contains=kw) | Q(location__contains=kw)) #검색키워드가 rname이나 location에 포함되어있으면 표시

        if order == '인원많은순':
            queryset = queryset.annotate(mnum=Count('men_infos'), wnum=Count('women_infos')).annotate(total_num=F('mnum') + F('wnum')).order_by('-total_num')
        
        if location == "우리동네":
            #user = self.request.user
            queryset = queryset.filter(location="강남")#(location=user.location)
        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()  # get_queryset 메서드 사용
        serializer = RoomSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    #방 생성 post
    def post(self, request, *args, **kwargs):
        serializer = RoomSerializer(data = request.data)
        if serializer.is_valid():
            # 유효성 검증이 통과되면, 데이터를 저장
            serializer.save()
            # 성공 응답 반환
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # 유효성 검증에 실패한 경우, 오류 응답 반환
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SelectedRoomView(APIView):
    def get(self, request, r_no):
        selected_room = get_object_or_404(room, rno=r_no)
        serializer = SelectedRoomSerializer(selected_room)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def delete(self, request, r_no, *args, **kwargs):
        selected_room = get_object_or_404(room, rno=r_no)
        selected_room.delete()
        return Response({"message": "방이 성공적으로 삭제되었습니다."}, status=status.HTTP_204_NO_CONTENT)

# 이상형 조건에 부합하는 상위 방 5개 조회 가능한 클래스
class RoomListIdealView(APIView):
    def get(self, request, *args, **kwargs):
        user_id = 1001
        user_info = userInfo.objects.get(kid=user_id)
        if user_info.ismale == True:
            return self.getMenIdealRoomList()
        elif user_info.ismale == False:
            return self.getWomenIdealRoomList()

    def getMenIdealRoomList(self):
        # 남성 사용자 정보 조회
        user_id = 1001
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
        face_type = men_info.w_face.get("type", "")
        face_tone = men_info.w_face.get("tone", "")
        hobbies = men_info.w_hobby.split(',')
        animals = men_info.w_animal.split(',')

        conditions = [
            Q(age__range=(start_age, end_age)),
            Q(job__in=jobs),
            Q(school__in=schools),
            Q(major__in=majors),
            Q(mbti__in=mbtis),
            Q(height__range=(start_height, end_height)),
            Q(body__in=bodies),
            Q(eyes__in=eyes),
            Q(face__type=face_type, face__tone=face_tone),
            Q(hobby__in=hobbies),
            Q(animal__in=animals)
        ]

        matching_info = {}

        for woman in matching_women:
            matching_count = 0
            for condition in conditions:
                if woman in matching_women.filter(condition):
                    matching_count += 1

            matching_info[woman.id] = {
                'matching_count': matching_count
            }

        ideal_women_list = sorted(matching_women, key=lambda x: -matching_info[x.id]['matching_count'])
        matching_rooms = []
        for woman in ideal_women_list:
            if woman.participate_room.rno not in matching_rooms:
                matching_rooms.append(woman.participate_room.rno)
            if len(matching_rooms) == 5:
                break

        serializer = RoomSerializer(room.objects.filter(rno__in=matching_rooms), many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def getWomenIdealRoomList(self):
        # 여성 사용자 정보 조회
        user_id = 1001
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
        face_type = women_info.m_face.get("type", "")
        face_tone = women_info.m_face.get("tone", "")
        hobbies = women_info.m_hobby.split(',')
        animals = women_info.m_animal.split(',')

        conditions = [
            Q(age__range=(start_age, end_age)),
            Q(job__in=jobs),
            Q(school__in=schools),
            Q(major__in=majors),
            Q(mbti__in=mbtis),
            Q(army__in=armies),
            Q(height__range=(start_height, end_height)),
            Q(body__in=bodies),
            Q(eyes__in=eyes),
            Q(face__type=face_type, face__tone=face_tone),
            Q(hobby__in=hobbies),
            Q(animal__in=animals)
        ]

        matching_info = {}

        for man in matching_men:
            matching_count = 0
            for condition in conditions:
                if man in matching_men.filter(condition):
                    matching_count += 1

            matching_info[man.id] = {
                'matching_count': matching_count
            }

        ideal_men_list = sorted(matching_men, key=lambda x: -matching_info[x.id]['matching_count'])
        matching_rooms = []
        for man in ideal_men_list:
            if man.participate_room.rno not in matching_rooms:
                matching_rooms.append(man.participate_room.rno)
            if len(matching_rooms) == 5:
                break

        serializer = RoomSerializer(room.objects.filter(rno__in=matching_rooms), many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

# 이상형 퍼센트가 60이상인 사람들을 조회하는 클래스
class UserIdealPercentageView(APIView):
    def get(self, request, *args, **kwargs):
        user_id = 1001
        user_info = userInfo.objects.get(kid=user_id)
        if user_info.ismale == True:
            return self.getMenIdealPercentage()
        elif user_info.ismale == False:
            return self.getWomenIdealPercentage()

    def getMenIdealPercentage(self):
        # 남성 사용자 정보 조회
        user_id = 1001
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
        face_type = men_info.w_face.get("type", "")
        face_tone = men_info.w_face.get("tone", "")
        hobbies = men_info.w_hobby.split(',')
        animals = men_info.w_animal.split(',')

        conditions = [
            Q(age__range=(start_age, end_age)),
            Q(job__in=jobs),
            Q(school__in=schools),
            Q(major__in=majors),
            Q(mbti__in=mbtis),
            Q(height__range=(start_height, end_height)),
            Q(body__in=bodies),
            Q(eyes__in=eyes),
            Q(face__type=face_type, face__tone=face_tone),
            Q(hobby__in=hobbies),
            Q(animal__in=animals)
        ]

        matching_info = {}

        for woman in matching_women:
            matching_count = 0
            for condition in conditions:
                if woman in matching_women.filter(condition):
                    matching_count += 1

            matching_info[woman.id] = {
                'matching_count': matching_count,
                'total_conditions': int(matching_count / len(conditions) * 100)
            }

        ideal_women_list = sorted(matching_women, key=lambda x: -matching_info[x.id]['matching_count'])
        ideal_women_list = [woman for woman in ideal_women_list if matching_info[woman.id]['total_conditions'] >= 60]

        serializer = PercentageSerializer(ideal_women_list, many=True, matching_info=matching_info)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def getWomenIdealPercentage(self):
        # 여성 사용자 정보 조회
        user_id = 1001
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
        face_type = women_info.m_face.get("type", "")
        face_tone = women_info.m_face.get("tone", "")
        hobbies = women_info.m_hobby.split(',')
        animals = women_info.m_animal.split(',')

        conditions = [
            Q(age__range=(start_age, end_age)),
            Q(job__in=jobs),
            Q(school__in=schools),
            Q(major__in=majors),
            Q(mbti__in=mbtis),
            Q(army__in=armies),
            Q(height__range=(start_height, end_height)),
            Q(body__in=bodies),
            Q(eyes__in=eyes),
            Q(face__type=face_type, face__tone=face_tone),
            Q(hobby__in=hobbies),
            Q(animal__in=animals)
        ]

        matching_info = {}

        for man in matching_men:
            matching_count = 0
            for condition in conditions:
                if man in matching_men.filter(condition):
                    matching_count += 1

            matching_info[man.id] = {
                'matching_count': matching_count,
                'total_conditions': int(matching_count / len(conditions) * 100)
            }

        ideal_men_list = sorted(matching_men, key=lambda x: -matching_info[x.id]['matching_count'])
        ideal_men_list = [man for man in ideal_men_list if matching_info[man.id]['total_conditions'] >= 60]

        serializer = PercentageSerializer(ideal_men_list, many=True, matching_info=matching_info)

        return Response(serializer.data, status=status.HTTP_200_OK)

# 방 내에서 이상형 퍼센트를 내림차순으로 조회하는 클래스
class RoomPercentageView(APIView):
    def get(self, request, *args, **kwargs):
        user_id = 1001
        user_info = userInfo.objects.get(kid=user_id)
        if user_info.ismale == True:
            return self.getMenRoomPercentage()
        elif user_info.ismale == False:
            return self.getWomenRoomPercentage()

    def getMenRoomPercentage(self):
        # 남성 사용자 정보 조회
        user_id = 1001
        user_info = userInfo.objects.get(kid=user_id)
        men_info = user_info.man_userInfo.first()

        # 여성 유저 필터링 (이상형 조건에 부합하는 여성들)
        matching_women = womenInfo.objects.filter(participate_room=men_info.participate_room)
        start_age, end_age = map(int, men_info.w_age.split('-'))
        start_height, end_height = map(int, men_info.w_height.split('-'))
        jobs = men_info.w_job.split(',')
        schools = men_info.w_school.split(',')
        majors = men_info.w_major.split(',')
        mbtis = men_info.w_mbti.split(',')
        bodies = men_info.w_body.split(',')
        eyes = men_info.w_eyes.split(',')
        face_type = men_info.w_face.get("type", "")
        face_tone = men_info.w_face.get("tone", "")
        hobbies = men_info.w_hobby.split(',')
        animals = men_info.w_animal.split(',')

        conditions = [
            Q(age__range=(start_age, end_age)),
            Q(job__in=jobs),
            Q(school__in=schools),
            Q(major__in=majors),
            Q(mbti__in=mbtis),
            Q(height__range=(start_height, end_height)),
            Q(body__in=bodies),
            Q(eyes__in=eyes),
            Q(face__type=face_type, face__tone=face_tone),
            Q(hobby__in=hobbies),
            Q(animal__in=animals)
        ]

        matching_info = {}

        for woman in matching_women:
            matching_count = 0
            for condition in conditions:
                if woman in matching_women.filter(condition):
                    matching_count += 1

            matching_info[woman.id] = {
                'matching_count': matching_count,
                'total_conditions': int(matching_count / len(conditions) * 100)
            }

        ideal_women_list = sorted(matching_women, key=lambda x: -matching_info[x.id]['matching_count'])

        serializer = PercentageSerializer(ideal_women_list, many=True, matching_info=matching_info)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def getWomenRoomPercentage(self):
        # 여성 사용자 정보 조회
        user_id = 1001
        user_info = userInfo.objects.get(kid=user_id)
        women_info = user_info.woman_userInfo.first()

        # 남성 유저 필터링 (이상형 조건에 부합하는 남성들)
        matching_men = menInfo.objects.filter(participate_room=women_info.participate_room)
        start_age, end_age = map(int, women_info.m_age.split('-'))
        start_height, end_height = map(int, women_info.m_height.split('-'))
        jobs = women_info.m_job.split(',')
        schools = women_info.m_school.split(',')
        majors = women_info.m_major.split(',')
        armies = women_info.m_army.split(',')
        mbtis = women_info.m_mbti.split(',')
        bodies = women_info.m_body.split(',')
        eyes = women_info.m_eyes.split(',')
        face_type = women_info.m_face.get("type", "")
        face_tone = women_info.m_face.get("tone", "")
        hobbies = women_info.m_hobby.split(',')
        animals = women_info.m_animal.split(',')

        conditions = [
            Q(age__range=(start_age, end_age)),
            Q(job__in=jobs),
            Q(school__in=schools),
            Q(major__in=majors),
            Q(mbti__in=mbtis),
            Q(army__in=armies),
            Q(height__range=(start_height, end_height)),
            Q(body__in=bodies),
            Q(eyes__in=eyes),
            Q(face__type=face_type, face__tone=face_tone),
            Q(hobby__in=hobbies),
            Q(animal__in=animals)
        ]

        matching_info = {}

        for man in matching_men:
            matching_count = 0
            for condition in conditions:
                if man in matching_men.filter(condition):
                    matching_count += 1

            matching_info[man.id] = {
                'matching_count': matching_count,
                'total_conditions': int(matching_count / len(conditions) * 100)
            }

        ideal_men_list = sorted(matching_men, key=lambda x: -matching_info[x.id]['matching_count'])

        serializer = PercentageSerializer(ideal_men_list, many=True, matching_info=matching_info)

        return Response(serializer.data, status=status.HTTP_200_OK)

# 방 내에서 매칭된 사람들을 제외한 나머지 사람들 중 가장 이상형에 부합하는 사람 조회하는 클래스
class RoomSecondRecommendationView(APIView):
    def get(self, request, *args, **kwargs):
        user_id = 1001
        user_info = userInfo.objects.get(kid=user_id)
        if user_info.ismale == True:
            return self.getMenSecondRecommendation()
        elif user_info.ismale == False:
            return self.getWomenSecondRecommendation()

    def getMenSecondRecommendation(self):
        # 남성 사용자 정보 조회
        user_id = 1001
        user_info = userInfo.objects.get(kid=user_id)
        men_info = user_info.man_userInfo.first()
        same_room_men = menInfo.objects.filter(participate_room=men_info.participate_room)
        matched_women = womenInfo.objects.filter(m_match__in=same_room_men)
        matching_women = womenInfo.objects.filter(participate_room=men_info.participate_room).exclude(id__in=matched_women)

        # 여성 유저 필터링 (이상형 조건에 부합하는 여성들)
        start_age, end_age = map(int, men_info.w_age.split('-'))
        start_height, end_height = map(int, men_info.w_height.split('-'))
        jobs = men_info.w_job.split(',')
        schools = men_info.w_school.split(',')
        majors = men_info.w_major.split(',')
        mbtis = men_info.w_mbti.split(',')
        bodies = men_info.w_body.split(',')
        eyes = men_info.w_eyes.split(',')
        face_type = men_info.w_face.get("type", "")
        face_tone = men_info.w_face.get("tone", "")
        hobbies = men_info.w_hobby.split(',')
        animals = men_info.w_animal.split(',')

        conditions = [
            Q(age__range=(start_age, end_age)),
            Q(job__in=jobs),
            Q(school__in=schools),
            Q(major__in=majors),
            Q(mbti__in=mbtis),
            Q(height__range=(start_height, end_height)),
            Q(body__in=bodies),
            Q(eyes__in=eyes),
            Q(face__type=face_type, face__tone=face_tone),
            Q(hobby__in=hobbies),
            Q(animal__in=animals)
        ]

        matching_info = {}

        for woman in matching_women:
            matching_count = 0
            for condition in conditions:
                if woman in matching_women.filter(condition):
                    matching_count += 1

            matching_info[woman.id] = {
                'matching_count': matching_count,
                'total_conditions': int(matching_count / len(conditions) * 100)
            }

        ideal_women_list = sorted(matching_women, key=lambda x: -matching_info[x.id]['matching_count'])

        ideal_woman = ideal_women_list[0]

        serializer = SecondRecommendationSerializer(ideal_woman, matching_info=matching_info)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def getWomenSecondRecommendation(self):
        # 여성 사용자 정보 조회
        user_id = 1001
        user_info = userInfo.objects.get(kid=user_id)
        women_info = user_info.woman_userInfo.first()
        same_room_women = womenInfo.objects.filter(participate_room=women_info.participate_room)
        matched_men = menInfo.objects.filter(w_match__in=same_room_women)
        matching_men = menInfo.objects.filter(participate_room=women_info.participate_room).exclude(id__in=matched_men)

        # 남성 유저 필터링 (이상형 조건에 부합하는 남성들)
        start_age, end_age = map(int, women_info.m_age.split('-'))
        start_height, end_height = map(int, women_info.m_height.split('-'))
        jobs = women_info.m_job.split(',')
        schools = women_info.m_school.split(',')
        majors = women_info.m_major.split(',')
        armies = women_info.m_army.split(',')
        mbtis = women_info.m_mbti.split(',')
        bodies = women_info.m_body.split(',')
        eyes = women_info.m_eyes.split(',')
        face_type = women_info.m_face.get("type", "")
        face_tone = women_info.m_face.get("tone", "")
        hobbies = women_info.m_hobby.split(',')
        animals = women_info.m_animal.split(',')

        conditions = [
            Q(age__range=(start_age, end_age)),
            Q(job__in=jobs),
            Q(school__in=schools),
            Q(major__in=majors),
            Q(mbti__in=mbtis),
            Q(army__in=armies),
            Q(height__range=(start_height, end_height)),
            Q(body__in=bodies),
            Q(eyes__in=eyes),
            Q(face__type=face_type, face__tone=face_tone),
            Q(hobby__in=hobbies),
            Q(animal__in=animals)
        ]

        matching_info = {}

        for man in matching_men:
            matching_count = 0
            for condition in conditions:
                if man in matching_men.filter(condition):
                    matching_count += 1

            matching_info[man.id] = {
                'matching_count': matching_count,
                'total_conditions': int(matching_count / len(conditions) * 100)
            }

        ideal_men_list = sorted(matching_men, key=lambda x: -matching_info[x.id]['matching_count'])

        ideal_man = ideal_men_list[0]

        serializer = SecondRecommendationSerializer(ideal_man, matching_info=matching_info)

        return Response(serializer.data, status=status.HTTP_200_OK)