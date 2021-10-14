from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

from .views import *

urlpatterns = [
    path("", IndexView.as_view(), name="index"),
    path("login", LoginView.as_view(), name="login"),
    path("place-bid/<int:id>", PlaceBidView.as_view(), name="place-bid"),
    path("item/<int:id>/<str:token>", ItemView.as_view(), name="item"),
    path("autobid/<str:token>", AutoBidView.as_view(), name="autobid"),
    path("autobid-activate/<str:token>", AutoBidActivateView.as_view(), name="autobid-activate"),

]

if settings.DEBUG:
  urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
