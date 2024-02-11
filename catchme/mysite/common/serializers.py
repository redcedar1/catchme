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
    class Meta:
        model = menInfo
        fields = '__all__'
        

class WomenInfoSerializer(serializers.ModelSerializer):
    womenPartys = WomenPartySerializer(many = True, read_only = True, source = 'women_party')
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