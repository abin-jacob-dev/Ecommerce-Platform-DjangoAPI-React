from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import (
    RegisterSerializer,
    EmailTokenObtainPairSerializer,
    LogoutSerializer,
    ProfileSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenBlacklistView
from django.contrib.auth import get_user_model

User = get_user_model()


# Create your views here.
class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class LoginAPIView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
    permission_classes = [AllowAny]


class LogoutAPIView(TokenBlacklistView):
    serializer_class = LogoutSerializer


class ProfileAPIView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
