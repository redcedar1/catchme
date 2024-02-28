
from rest_framework import serializers
from common.models import *
from common.serializers import *


class RoomSerializer(serializers.ModelSerializer):
    #menInfos = MenInfoSerializer(many = True, read_only = True, source = 'men_infos')# source에 등록한 것은 model에서 related_name항목
    #womenInfos = WomenInfoSerializer(many = True, read_only = True,source = 'women_infos')

    mnum = serializers.SerializerMethodField()
    wnum = serializers.SerializerMethodField()


    def get_mnum(self, obj):
        # menInfo 관련 객체의 개수를 반환
        return menInfo.objects.filter(participate_room=obj).count()

    def get_wnum(self, obj):
        # womenInfo 관련 객체의 개수를 반환
        return womenInfo.objects.filter(participate_room=obj).count()

    class Meta :
        model = room

        fields = ('rno','rname','mnum','wnum','each_match','location','matching')

class SelectedRoomSerializer(serializers.ModelSerializer):
    menInfos = MenInfoSerializer(many = True, read_only = True, source = 'men_infos')# source에 등록한 것은 model에서 related_name항목
    womenInfos = WomenInfoSerializer(many = True, read_only = True,source = 'women_infos')

    mnum = serializers.SerializerMethodField()
    wnum = serializers.SerializerMethodField()


    def get_mnum(self, obj):
        # men_infos 관련 객체의 개수를 반환합니다.
        return obj.men_infos.count()
    
    def get_wnum(self, obj):
        # men_infos 관련 객체의 개수를 반환합니다.
        return obj.women_infos.count()

    class Meta :
        model = room
        fields = '__all__'

class PercentageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    nickname = serializers.CharField()
    participate_room = serializers.CharField()
    matching_count = serializers.SerializerMethodField()
    total_conditions = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        self.matching_info = kwargs.pop('matching_info', {})
        super().__init__(*args, **kwargs)

    def get_matching_count(self, obj):
        return self.matching_info.get(obj.id, {}).get('matching_count', 0)

    def get_total_conditions(self, obj):
        return self.matching_info.get(obj.id, {}).get('total_conditions', 0)

    class Meta :
        model = userInfo

        fields = ('id', 'nickname', 'participate_room')

class SecondRecommendationSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    nickname = serializers.CharField()
    matching_count = serializers.SerializerMethodField()
    total_conditions = serializers.SerializerMethodField()

    def get_matching_count(self, obj):
        return getattr(obj, 'matching_count', None)

    def get_total_conditions(self, obj):
        return getattr(obj, 'total_conditions', None)

    class Meta :
        model = userInfo

        fields = ('id', 'nickname')