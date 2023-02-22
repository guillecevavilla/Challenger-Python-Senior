from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from simple_history.admin import SimpleHistoryAdmin
from .models import  Oficial, People



class UserAdmin(SimpleHistoryAdmin):
    pass



class PeopleAdmin(SimpleHistoryAdmin):
    pass



admin.site.register(Oficial, UserAdmin )
admin.site.register(People, PeopleAdmin )



