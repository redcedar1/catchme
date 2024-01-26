from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class menInfo(models.Model):
    #남성 카톡 고유번호(기본키)
    mkid = models.IntegerField(primary_key=True)
    #앱 내에서 사용할 닉네임
    nickname = models.TextField()

    #자기소개 시 입력되는 내 정보
    age = models.IntegerField(null=True)
    job = models.CharField(max_length=50, null=True, blank=True)
    school = models.CharField(max_length=50, null=True, blank=True)
    major = models.CharField(max_length=50, null=True, blank=True)
    mbti = models.CharField(max_length=10, null=True, blank=True)
    army = models.CharField(max_length=10, null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    body = models.CharField(max_length=10, null=True, blank=True)
    eyes = models.CharField(max_length=10, null=True, blank=True)
    face = models.CharField(max_length=10, null=True, blank=True)
    hobby = models.CharField(max_length=100, null=True, blank=True)

    #레디 여부
    ready = models.BooleanField(default=False)
    #참가자 평균 나이
    avgage = models.IntegerField(null=True)
    #이상형 정보
    w_age = models.CharField(max_length=50, null=True, blank=True)
    w_job = models.CharField(max_length=50, null=True, blank=True)
    w_school = models.CharField(max_length=50, null=True, blank=True)
    w_major = models.CharField(max_length=50, null=True, blank=True)
    w_mbti = models.CharField(max_length=10, null=True, blank=True)
    w_height = models.IntegerField(null=True, blank=True)
    w_body = models.CharField(max_length=10, null=True, blank=True)
    w_eyes = models.CharField(max_length=10, null=True, blank=True)
    w_face = models.CharField(max_length=10, null=True, blank=True)
    w_hobby = models.CharField(max_length=100, null=True, blank=True)

    #자유로운 자기소개
    free = models.TextField(null=True, blank=True)
    #자기소개 시 입력하는 실제 카카오톡 아이디
    kakaotalk_id = models.CharField(max_length=20, null=True, blank=True)
    #친구 초대 링크
    link = models.CharField(max_length=20, null=True, blank=True)
    #보유 코인
    coin = models.IntegerField(null=True)
    #현재 참가한 방 번호(남성의 외래키이자 방의 기본키)
    rno = models.ForeignKey('room', on_delete=models.SET_NULL, null=True, blank=True, db_column='rno',related_name = 'men_infos')
    #매칭된 여성의 카톡 고유번호(남성의 외래키이자 여성의 기본키)
    wkid = models.ForeignKey('womenInfo', on_delete=models.SET_NULL, null=True, blank=True, db_column='wkid')

    def __str__(self):
        return str(self.pk)

class menNotice(models.Model):
    #남성 카톡 고유번호(menNotice의 기본키이자 외래키, 남성의 기본키)
    mkid = models.ForeignKey('menInfo', on_delete=models.CASCADE)
    #menNotice의 고유번호(기본키)
    num = models.AutoField(primary_key=True)
    #알림 내용
    notice = models.TextField(null=True, blank=True)
    #알림 생성 시간
    created_at = models.DateTimeField(auto_now_add=True)

class womenInfo(models.Model):
    #여성 카톡 고유번호(기본키)
    wkid = models.IntegerField(primary_key=True)
    #앱 내에서 사용할 닉네임
    nickname = models.TextField()

    #자기소개 시 입력되는 내 정보
    age = models.IntegerField(null=True)
    job = models.CharField(max_length=50, null=True, blank=True)
    school = models.CharField(max_length=50, null=True, blank=True)
    major = models.CharField(max_length=50, null=True, blank=True)
    mbti = models.CharField(max_length=10, null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    body = models.CharField(max_length=10, null=True, blank=True)
    eyes = models.CharField(max_length=10, null=True, blank=True)
    face = models.CharField(max_length=10, null=True, blank=True)
    hobby = models.CharField(max_length=100, null=True, blank=True)

    #레디 여부
    ready = models.BooleanField(default=False)
    #참가자 평균 나이
    avgage = models.IntegerField(null=True)
    #이상형 정보
    m_age = models.CharField(max_length=50, null=True, blank=True)
    m_job = models.CharField(max_length=50, null=True, blank=True)
    m_school = models.CharField(max_length=50, null=True, blank=True)
    m_major = models.CharField(max_length=50, null=True, blank=True)
    m_mbti = models.CharField(max_length=10, null=True, blank=True)
    m_army = models.CharField(max_length=10, null=True, blank=True)
    m_height = models.IntegerField(null=True, blank=True)
    m_body = models.CharField(max_length=10, null=True, blank=True)
    m_eyes = models.CharField(max_length=10, null=True, blank=True)
    m_face = models.CharField(max_length=10, null=True, blank=True)
    m_hobby = models.CharField(max_length=100, null=True, blank=True)

    #자유로운 자기소개
    free = models.TextField(null=True, blank=True)
    #자기소개 시 입력하는 실제 카카오톡 아이디
    kakaotalk_id = models.CharField(max_length=20, null=True, blank=True)
    #친구 초대 링크
    link = models.CharField(max_length=20, null=True, blank=True)
    #보유 코인
    coin = models.IntegerField(null=True)
    #현재 참가한 방 번호(여성의 외래키이자 방의 기본키)
    rno = models.ForeignKey('room', on_delete=models.SET_NULL, null=True, blank=True, db_column='rno', related_name = 'women_infos')
    #매칭된 남성의 카톡 고유번호(여성의 외래키이자 남성의 기본키)
    mkid = models.ForeignKey('menInfo', on_delete=models.SET_NULL, null=True, blank=True, db_column='mkid')

    def __str__(self):
        return str(self.pk)

class womenNotice(models.Model):
    #여성 카톡 고유번호(womenNotice의 기본키이자 외래키, 여성의 기본키)
    wkid = models.ForeignKey('womenInfo', on_delete=models.CASCADE)
    #womenNotice의 고유번호(기본키)
    num = models.AutoField(primary_key=True)
    #알림내용
    notice = models.TextField(null=True, blank=True)
    #알림 생성 시간
    created_at = models.DateTimeField(auto_now_add=True)

class room(models.Model):
    #방의 고유번호(방의 기본키)
    rno = models.AutoField(primary_key=True)
    #방 제목
    rname = models.TextField()
    #방 생성 시간
    created_at = models.DateTimeField(auto_now_add=True)
    #방 안에서 미팅 성사 개수
    meetingnum = models.IntegerField(default=0)
    #레디한 인원 수
    readynum = models.IntegerField(default=0)
    #방 생성시 입력하는 위치
    location = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return str(self.pk)

class matchingInfo(models.Model):
    #매칭정보의 고유번호(매칭정보의 기본키)
    matchingnum = models.CharField(max_length=10, primary_key=True)
    #매칭이 성사된 방 번호(매칭정보의 외래키이자 방의 기본키)
    rno = models.ForeignKey('room', on_delete=models.SET_NULL, null=True, blank=True, db_column='rno')

    #매칭된 남성의 카톡 고유번호(매칭정보의 외래키이자 남성의 기본키)
    mkid = models.ForeignKey('menInfo', on_delete=models.SET_NULL, null=True, blank=True, db_column='mkid')
    #매칭된 여성의 카톡 고유번호(매칭정보의 외래키이자 여성의 기본키)
    wkid = models.ForeignKey('womenInfo', on_delete=models.SET_NULL, null=True, blank=True, db_column='wkid')

    def __str__(self):
        return str(self.pk)

class menParty(models.Model):
    #접속한 남성의 카톡 고유번호(menParty의 기본키, 외래키이자 남성의 기본키)
    mkid = models.ForeignKey('menInfo', on_delete=models.CASCADE,related_name = 'men_party')
    #친구 고유 번호(기본키)
    pnum = models.AutoField(primary_key=True)
    #친구 정보
    name = models.CharField(max_length = 10, null = True, blank = True)
    age = models.IntegerField(null=True)
    animal = models.CharField(max_length=20, null=True, blank=True)
    job = models.CharField(max_length=50, null=True, blank=True)
    school = models.CharField(max_length=50, null=True, blank=True)
    major = models.CharField(max_length=50, null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    body = models.CharField(max_length=10, null=True, blank=True)
    selected = models.BooleanField(default = False)

    def __str__(self):
        return f"{self.mkid} - {self.pnum}"

class womenParty(models.Model):
    #접속한 여성의 카톡 고유번호(womenParty의 기본키, 외래키이자 여성의 기본키)
    wkid = models.ForeignKey('womenInfo', on_delete=models.CASCADE,related_name = 'women_party')
    #친구 고유 번호(기본키)
    pnum = models.AutoField(primary_key=True)
    #친구 정보
    name = models.CharField(max_length = 10, null = True, blank = True)
    age = models.IntegerField(null=True)
    animal = models.CharField(max_length=20, null=True, blank=True)
    job = models.CharField(max_length=50, null=True, blank=True)
    school = models.CharField(max_length=50, null=True, blank=True)
    major = models.CharField(max_length=50, null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    body = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return f"{self.wkid} - {self.pnum}"