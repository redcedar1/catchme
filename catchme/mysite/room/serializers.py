
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
        model = menInfo
        fields = '__all__'
        

class RoomSerializer(serializers.ModelSerializer):
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
