from django.contrib import admin
from .models import *#menInfo,womenInfo,room,matchingInfo,menParty,womenParty
# Register your models here.

admin.site.register(menInfo)
admin.site.register(womenInfo)
admin.site.register(room)
admin.site.register(matchingInfo)
admin.site.register(menParty)
admin.site.register(womenParty)
admin.site.register(userInfo)
