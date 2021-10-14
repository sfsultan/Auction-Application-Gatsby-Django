import datetime
import pytz
from threading import Thread

from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.db.models import Count, Sum
from django.db.models import Q, F
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate

from rest_framework import response

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.views.decorators.csrf import csrf_exempt

from .models import *
from .serializers import *
from .paginations import *



# Create your views here.
class IndexView(APIView, PageNumberPagination):

    def get(self, request, format=None):
        query = Item.objects

        # query = build_search_query(self.request.GET)
        search = self.request.GET.get('search', None)
        price_sort = self.request.GET.get('price_sort', None)

        if search is not None:
            query = query.filter(Q(title__icontains=search) | Q(description__icontains=search))

        if price_sort is not None:
            if price_sort == 'desc':
                query = query.annotate(max_bid=Max('bids__bid')).order_by('-max_bid')
            if price_sort == 'asc':
                query = query.annotate(max_bid=Max('bids__bid')).order_by('max_bid')

        items = query.all()

        page = self.paginate_queryset(items, request, view=self)

        serializer = ItemSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)


class ItemView(APIView):

    def get(self, request, id=None, token=None, format=None):

        if not id:
            return Response(status=status.HTTP_404_NOT_FOUND)

        item = get_object_or_404(Item, id=id)
        user = get_object_or_404(CustomUser, username=token)

        auto_bidding_active = Autobid.objects.filter(item=item, bidder=user).exists()

        serializer = ItemSerializer(item)

        response = {"auto_bidding_active": auto_bidding_active}
        response.update(serializer.data)

        return Response(response)



class LoginView(APIView):

    def post(self, request):
        print(request.data)
        serializer = LoginSerializer(data=request.data)
        #es = Elasticsearch("109.74.197.76:9200")

        if serializer.is_valid():
            vd = serializer.validated_data
            print(vd)
            username = vd["username"]
            password = vd["password"]

            user = authenticate(username=username, password=password)

            if not user:
                raise ValidationError({'username': {'User not found'}})

            return Response({
                "username": user.username,
                "token": user.username,
            }, status=status.HTTP_200_OK)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class PlaceBidView(APIView):

    def post(self, request, id=None):

        item = get_object_or_404(Item, pk=id)

        serializer = PlaceBidSerializer(data=request.data)

        if serializer.is_valid():
            vd = serializer.validated_data
            bid_amount = vd["bid_amount"]
            token = vd["token"]

            utc=pytz.UTC

            if utc.localize(datetime.datetime.now()) > item.closing_time:
                raise ValidationError({'bid_amount': {'Bidding has closed!'}})

            if bid_amount <= item.highest_bid():
                raise ValidationError({'bid_amount': {'Your bid must be greater than the previous highest bid.'}})

            user = CustomUser.objects.get(username=token)
            try:
                new_bid = Bid.objects.create(bid=bid_amount, item=item, bidder=user)
            except:
                return Response({"msg": "Increase your bid"}, status=status.HTTP_400_BAD_REQUEST)

            autobids = Autobid.objects.filter(item=item).exclude(bidder=user).all()

            for autobid in autobids:
                if autobid.bidder.max_amount >= (autobid.bidder.autobid_spending(item) + item.highest_bid() + 1):
                    try:
                        other_bid = Bid.objects.create(bid=item.highest_bid() + 1, item=item, bidder=autobid.bidder)
                        autobid.current_spending = other_bid.bid
                        autobid.save()
                    except:
                        print("Unable to place a bid!")

            return Response(ItemSerializer(item).data, status=status.HTTP_200_OK)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class AutoBidView(APIView):

    def get(self, request, token=None):

        user = get_object_or_404(CustomUser, username=token)

        serializer = UserSerializer(user)

        return Response(serializer.data)


    def post(self, request, token=None):

        print(request.data)

        user = get_object_or_404(CustomUser, username=token)

        serializer = AutoBidSerializer(data=request.data)

        if serializer.is_valid():
            vd = serializer.validated_data
            max_amount = vd["max_amount"]

            print(vd)
            user.max_amount = max_amount
            user.save()

            return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class AutoBidActivateView(APIView):

    def get(self, request, token=None):

        user = get_object_or_404(CustomUser, username=token)

        serializer = UserSerializer(user)

        return Response(serializer.data)


    def post(self, request, token=None):

        print(request.data)

        user = get_object_or_404(CustomUser, username=token)
        item = get_object_or_404(Item, pk=request.data['item_id'])

        if request.data['autobid_activate'] == True:
            Autobid.objects.create(item=item, bidder=user)
            return Response({"msg": "Autobidding activated"}, status=status.HTTP_200_OK)
        elif request.data['autobid_activate'] == False:
            Autobid.objects.filter(item=item, bidder=user).delete()
            return Response({"msg": "Autobidding deactivated"}, status=status.HTTP_200_OK)
        else:
            return Response({"msg": "Either activate or deactivate bidding"}, status=status.HTTP_400_BAD_REQUEST)
