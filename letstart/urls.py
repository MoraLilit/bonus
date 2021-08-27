from django.urls import path, include
from django.contrib.auth.views import LogoutView, LoginView
from . import views


urlpatterns = [
    path('', views.login, name='login'),
    path('bonus/', views.index, name='google_login'),
    path('bonus/accounts/', include('allauth.urls')),
    path('bonus/save/', views.save, name='save_to_db'),
    path('bonus/receive-bonus/', views.receive_bonus, name='save_to_db'),
    path('bonus/admin_bonus/', views.admin_bonus, name='send_all_admin_bonus'),
    path('bonus/logout', LogoutView.as_view(), name="logout"),
]
