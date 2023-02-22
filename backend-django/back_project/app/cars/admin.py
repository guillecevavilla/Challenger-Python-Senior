from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin
from .models import Vehicle



class VehicleAdmin(SimpleHistoryAdmin):
    pass



admin.site.register(Vehicle, VehicleAdmin )




