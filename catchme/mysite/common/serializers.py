from rest_framework import serializers
from common.models import *

class MenPartySerializer(serializers.ModelSerializer):
    class Meta:
        model = menParty
        fields = '__all__'

class WomenPartySerializer(serializers.ModelSerializer):
    class Meta:
        model = womenParty
        fields = '__all__'

class MenInfoSerializer(serializers.ModelSerializer):
    menPartys = MenPartySerializer(many = True, read_only = True, source = 'men_party')
    w_crush_kid = serializers.SerializerMethodField()
    w_match_kid = serializers.SerializerMethodField()

    hobby = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    keyword = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    face = serializers.JSONField()
    w_face = serializers.JSONField()

    def get_w_crush_kid(self, obj):
        if obj.w_crush:#w_crush 있으면 kid반환 없으면 none반환
            return obj.w_crush.user.kid
        return None

    def get_w_match_kid(self,obj) :
        if obj.w_match:
            return obj.w_match.user.kid
        return None

    class Meta:
        model = menInfo
        fields = '__all__'
        

class WomenInfoSerializer(serializers.ModelSerializer):
    womenPartys = WomenPartySerializer(many = True, read_only = True, source = 'women_party')
    m_match_kid = serializers.SerializerMethodField()

    hobby = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    keyword = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    face = serializers.JSONField()
    m_face = serializers.JSONField()

    def get_m_match_kid(self,obj):
        if obj.m_match:
            return obj.m_match.user.kid
        return None
    class Meta:
        model = womenInfo
        fields = '__all__'
        



class UserInfoSerializer(serializers.ModelSerializer):
    
    extra_info = serializers.SerializerMethodField()
    
    class Meta:
        model = userInfo
        fields = '__all__'

    def get_extra_info(self, obj):
        if obj.ismale:
          serializer = MenInfoSerializer(obj.man_userInfo.all(), many=True)
        else:
            serializer = WomenInfoSerializer(obj.woman_userInfo.all(), many=True)
        return serializer.data


class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = '__all__'

class UserNoticeSerializer(serializers.ModelSerializer):
    notice = NoticeSerializer(many = True, read_only = True, source = 'notices')
    
    class Meta:
        model = userInfo
        fields = '__all__'



class MatchingHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = matchingHistory
        fields = '__all__'

class UserMatchingHistorySerializer(serializers.ModelSerializer):
    matching_history = MatchingHistorySerializer(many = True, read_only = True, source = 'matchingHistory_userInfo')
    
    class Meta:
        model = userInfo
        fields = '__all__'
 