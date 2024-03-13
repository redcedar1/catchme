from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    #CustomUserManager 클래스는 유저 생성 및 관리를 담당하는 매니저 클래스
    use_in_migrations = True

    def create_user(self, kid, password=None, **extra_fields):#일반user 생성 메서드
        if not kid:#kid만 필수
            raise ValueError('The kid field must be set')
        user = self.model(kid=kid, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, kid, password=None, **extra_fields):#superuser 생성 메서드

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(kid, password, **extra_fields)
    #get_by_natural_key 메서드는 자연 키를 이용해 유저를 조회하는 메서드
    def get_by_natural_key(self, kid):#natural_key를 참조해야 할때 username이 아닌 kid로 수정
        return self.get(**{self.model.USERNAME_FIELD: kid})

class userInfo(AbstractBaseUser, PermissionsMixin): 
    """
    장고의 기본 제공 클래스인 User모델을 상속한 userInfo모델을 제작하여 추후에 simpleJWT를 사용할 환경 구성(simpleJWT는 전부 User을 사용한다고 가정한다)
    userInfo가 User 모델을 상속하기 때문에 CustomUserManager()클래스로 superuser, staff, 일반 user create용 메서드 제작 
    PermissionsMixin은 Django에서 제공하는 권한 관련 필드(is_superuser, is_staff, user_permissions)를 추가해주는 믹스인 클래스
    
    """
    
    
    objects = CustomUserManager() #컨트롤 매니저로 CustomUserManager 사용
     #사용자 카톡 고유 번호(기본키)
    kid = models.BigIntegerField(primary_key=True, db_index=True)
    #사용자 위치 정보
    location = models.CharField(max_length=50,null=True, blank=True)
    ismale = models.BooleanField(blank=True,default=False)

    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'kid'#userName_field로 User 모델, 즉 기본 장고 User모델의 username(id)를 대체
    REQUIRED_FIELDS = ['location', 'ismale']#createsuperuser사용할때 물어볼 field

    def __str__(self):
        return str(self.kid)#return은 str이어야 한다


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
    w_height = models.CharField(max_length=10, null=True, blank=True)
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

    readed = models.BooleanField(default = False)
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
    m_height = models.CharField(max_length=10, null=True, blank=True)
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

    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return str(self.pk)
    

class matchingHistory(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(userInfo, on_delete = models.CASCADE, related_name = 'matchingHistory_userInfo')
    matched_user = models.IntegerField(null=True, blank=True) 

    def __str__(self):
        return str(self.pk)


class menParty(models.Model):
    id = models.AutoField(primary_key=True)
    #리더 남성
    leader_man = models.ForeignKey('menInfo', on_delete=models.CASCADE,related_name = 'men_party')
    #친구 정보
    nickname = models.CharField(max_length=20,null=True,blank=True)
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
    nickname = models.CharField(max_length=20,null =True,blank = True)
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

