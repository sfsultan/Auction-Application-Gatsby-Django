from rest_framework import serializers as sr
from rest_framework.fields import ReadOnlyField
from .models import *

class LoginSerializer(sr.Serializer):
    username = sr.CharField()
    password = sr.CharField()


class PlaceBidSerializer(sr.Serializer):
    bid_amount = sr.IntegerField()
    token = sr.CharField()

class AutoBidSerializer(sr.Serializer):
    max_amount = sr.IntegerField()

class BidSerializer(sr.ModelSerializer):

    class Meta:
        model = Bid
        fields = "__all__"
        ordering = ['created_at']

    def to_representation(self, instance):
        representation = super(BidSerializer, self).to_representation(instance)
        representation['created_at'] = instance.created_at.strftime("%Y-%m-%d %H:%M:%S")
        return representation


class ItemSerializer(sr.ModelSerializer):
    bids = BidSerializer(many=True, read_only=True)
    highest_bid = sr.ReadOnlyField()

    class Meta:
        model = Item
        fields = "__all__"
        ordering = ['created_at']

    def to_representation(self, instance):
        representation = super(ItemSerializer, self).to_representation(instance)
        representation['created_at'] = instance.created_at.strftime("%Y-%m-%d %H:%M:%S")
        representation['closing_time'] = instance.closing_time.strftime("%Y-%m-%d %H:%M:%S")
        return representation


class UserSerializer(sr.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "first_name", "last_name", "email", 'max_amount']
        ordering = ['id']
