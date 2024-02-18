
from django.contrib import admin
from .models import *

from django import forms

from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
# Register your models here.

admin.site.register(menInfo)
admin.site.register(womenInfo)
admin.site.register(room)
admin.site.register(matchingInfo)
admin.site.register(menParty)
admin.site.register(womenParty)
admin.site.register(userInfo)
admin.site.register(payment)
admin.site.register(Notice)

class UserCreationForm(forms.ModelForm):
   """유저 생성 폼 근데 패스워드 확인 두번하는건 superuser create할때 하려고 한거"""
   password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
   password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

   class Meta:
       model = userInfo
       fields = ('kid', 'location')

   def clean_password2(self): #
       # 비밀번호 두번작성 한거 확인
       password1 = self.cleaned_data.get("password1")
       password2 = self.cleaned_data.get("password2")
       if password1 and password2 and password1 != password2:
           raise ValidationError("Passwords don't match")
       return password2

   def save(self, commit=True):
       # Save the provided password in hashed format
       user = super().save(commit=False)
       if commit:
           user.save()
       return user


class UserChangeForm(forms.ModelForm):
   """기존 유저의 정보를 수정하는 폼
    비밀번호 필드는 ReadOnlyPasswordHashField로 설정되어 있어, 비밀번호 해시를 보여주되 수정은 불가능
   """
   password = ReadOnlyPasswordHashField()

   class Meta:
       model = userInfo
       fields = ('kid', 'location','ismale','is_staff','is_admin')


class UserAdmin(BaseUserAdmin):
   """
    관리자 사이트에서 유저 모델을 어떻게 표시할지 정의하는 클래스
    UserCreationForm과 UserChangeForm을 사용하여 유저 생성 및 수정 기능을 제공
    """
   form = UserChangeForm
   add_form = UserCreationForm

   # The fields to be used in displaying the User model.
   # These override the definitions on the base UserAdmin
   # that reference specific fields on auth.User.
   #list_display는 관리자 사이트에서 유저 목록을 어떤 필드로 표시할지 설정하는 속성
   list_display = ('kid', 'location', 'ismale')

   #search_fields는 관리자 사이트에서 유저를 검색할 때 사용할 필드를 설정하는 속성
   search_fields = ('kid',)
   filter_horizontal = ()


#UserAdmin을 관리자 사이트에 등록 이렇게 하면 관리자 사이트에서 UserAdmin 설정에 따라 유저 모델관리가능
admin.site.register(User, UserAdmin)
