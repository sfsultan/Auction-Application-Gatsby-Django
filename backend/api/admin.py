from django.contrib import admin
from .models import *
# Register your models here.

admin.site.site_header = "My Awesome Auction Website Admin"
admin.site.site_title = "My Awesome Auction Website"
admin.site.index_title = "Welcome to My Awesome Auction Website"


admin.site.register(Item)
admin.site.register(Bid)
