from django.db import models
from django.contrib.auth.models import User

class userInfo(models.Model):
    #사용자 카톡 고유 번호(기본키)
    kid = models.BigIntegerField(primary_key=True, db_index=True)
    #사용자 위치 정보
    location = models.CharField(max_length=50)
    ismale = models.BooleanField()


class menInfo(models.Model):
    id = models.AutoField(primary_key=True)
    #userInfo 인스턴스 연결
    user = models.ForeignKey(userInfo, on_delete = models.CASCADE, related_name = 'man_userInfo')
    
    #앱 내에서 사용할 닉네임
    nickname = models.CharField(max_length=50)
    #사용자가 선택한 말풍선 종류
    chat = models.CharField(max_length=10, null=True, blank=True)

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
    animal = models.CharField(max_length=20, null=True, blank=True) #animal 속성 추가
    location = models.CharField(max_length=50, null=True, blank=True)
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
    w_animal = models.CharField(max_length=20, null=True, blank=True) #w_animal 속성 추가

    #자유로운 자기소개
    free = models.TextField(null=True, blank=True)
    #자기소개 시 입력하는 실제 카카오톡 아이디
    kakaotalk_id = models.CharField(max_length=20, null=True, blank=True)
    #친구 초대 링크
    link = models.CharField(max_length=20, null=True, blank=True)
    #보유 코인
    coin = models.IntegerField(default=0) #default 값을 0으로 수정
    #현재 참가한 방 #related_name은 room객체에서 menInfo에 접근하기 위해 사용된다.
    participate_room = models.ForeignKey('room', on_delete=models.SET_NULL, null=True, blank=True, db_column='participate_room',related_name = 'men_infos')
    #방에서 선택한 여성 #마찬가지로 related_name은 womenInfo에서 meninfo에 접근하기 위해 사용
    w_crush = models.ForeignKey('womenInfo', on_delete=models.SET_NULL, null=True, blank=True, db_column='w_crush',related_name ="m_crush")
    #매칭된 여성
    w_match = models.ForeignKey('womenInfo', on_delete=models.SET_NULL, null=True, blank=True, db_column='w_match',related_name="m_matched")
    
    def __str__(self):
        return str(self.user)

class Notice(models.Model):
    id = models.AutoField(primary_key=True)
    #userInfo 인스턴스 연결
    user = models.ForeignKey('userInfo', on_delete=models.CASCADE,related_name = "notices")
    #알림 내용
    notice = models.TextField(null=True, blank=True)
    #알림 생성 시간
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class womenInfo(models.Model):
    id = models.AutoField(primary_key=True)
     #userInfo 인스턴스 연결
    user = models.ForeignKey(userInfo, on_delete = models.CASCADE,related_name = 'woman_userInfo')
    #앱 내에서 사용할 닉네임
    nickname = models.CharField(max_length=50)
    #사용자가 선택한 말풍선 종류
    chat = models.CharField(max_length=10, null=True, blank=True)

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
    animal = models.CharField(max_length=20, null=True, blank=True) #animal 속성 추가
    location = models.CharField(max_length=50, null=True, blank=True)
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
    m_animal = models.CharField(max_length=20, null=True, blank=True) #m_animal 속성 추가

    #자유로운 자기소개
    free = models.TextField(null=True, blank=True)
    #자기소개 시 입력하는 실제 카카오톡 아이디
    kakaotalk_id = models.CharField(max_length=20, null=True, blank=True)
    #친구 초대 링크
    link = models.CharField(max_length=20, null=True, blank=True)
    #보유 코인
    coin = models.IntegerField(default=0) #default 값을 0으로 수정
   #현재 참가한 방
    participate_room = models.ForeignKey('room', on_delete=models.SET_NULL, null=True, blank=True, db_column='participate_room',related_name = 'women_infos')
    
    #매칭된 남성
    m_match = models.ForeignKey('menInfo', on_delete=models.SET_NULL, null=True, blank=True, db_column='m_match')
     
    def __str__(self):
        return str(self.user)


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
    #매칭 진행 중 여부
    matching = models.BooleanField(default=False)
    #몇대몇 미팅하는지
    each_match = models.IntegerField(default = 0)

    def __str__(self):
        return str(self.pk)

class matchingInfo(models.Model):
    #매칭정보의 고유번호(매칭정보의 기본키)
    matchingnum = models.CharField(max_length=10, primary_key=True)
    #매칭이 성사된 방 
    matched_room = models.ForeignKey('room', on_delete=models.SET_NULL, null=True, blank=True, db_column='matched_room')

    #매칭된 남성
    matched_man = models.ForeignKey('menInfo', on_delete=models.SET_NULL, null=True, blank=True, db_column='matched_man')
    #매칭된 여성
    matched_woman = models.ForeignKey('womenInfo', on_delete=models.SET_NULL, null=True, blank=True, db_column='matched_woman')

    def __str__(self):
        return str(self.pk)


#친구 이름 속성 삭제
class menParty(models.Model):
    id = models.AutoField(primary_key=True)
    #리더 남성
    leader_man = models.ForeignKey('menInfo', on_delete=models.CASCADE,related_name = 'men_party')
    #친구 정보
    age = models.IntegerField(null=True)
    animal = models.CharField(max_length=20, null=True, blank=True)
    job = models.CharField(max_length=50, null=True, blank=True)
    school = models.CharField(max_length=50, null=True, blank=True)
    major = models.CharField(max_length=50, null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    body = models.CharField(max_length=10, null=True, blank=True)
    selected = models.BooleanField(default = False)

    def __str__(self):
        return str(self.id)


#친구 이름 속성 삭제
class womenParty(models.Model):
    id = models.AutoField(primary_key=True)
    #리더 여성
    leader_woman = models.ForeignKey('womenInfo', on_delete=models.CASCADE,related_name = 'women_party')
    #친구 정보
    age = models.IntegerField(null=True)
    animal = models.CharField(max_length=20, null=True, blank=True)
    job = models.CharField(max_length=50, null=True, blank=True)
    school = models.CharField(max_length=50, null=True, blank=True)
    major = models.CharField(max_length=50, null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    body = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return str(self.id)

class payment(models.Model):
    #결제 내역 기본키(고유 번호)
    tid = models.CharField(primary_key=True, max_length=20)
    #결제 성공 시점
    created_at = models.DateTimeField(auto_now_add=True)
    #결제한 사용자
    pay_user = models.ForeignKey('userInfo', on_delete=models.SET_NULL, null=True, blank=True, related_name='payment')

