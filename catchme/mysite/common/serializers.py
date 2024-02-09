from rest_framework import serializers
from common.models import *




class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = userInfo
        fields = '__all__'

class NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notice
        fields = '__all__'

class UserNoticeSerializer(serializers.ModelSerializer):
    notice = NoticeSerializer(many = True, read_only = True, source = 'notices')
    
    class Meta:
        model = userInfo
        fields = '__all__'