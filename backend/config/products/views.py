from rest_framework import generics, status
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny,
    IsAuthenticatedOrReadOnly,
)
from .models import Product
from .serializers import ProductSerializer
from .permissions import IsSellerOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction

# Create your views here.


# GET,POST
class ProductListCreateAPIView(generics.ListCreateAPIView):
    # queryset = Product.objects.filter(is_sold=False)
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_sold=False)

        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")

        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class MyProductsAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user)


# GET,PUT,PATCH,DELETE
class ProductDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsSellerOrReadOnly]


class CheckoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_ids = request.data.get("product_ids")
        if not product_ids:
            return Response(
                {"error": "No product IDs provided"}, status=status.HTTP_400_BAD_REQUEST
            )
        with transaction.atomic():
            products = Product.objects.select_for_update().filter(id__in=product_ids)
            if products.count() != len(product_ids):
                return Response(
                    {"error": "Some products were not found"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            sold_products = products.filter(is_sold=True).exists()
            if sold_products:
                return Response(
                    {"error": "Some selected products are already sold"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            products.update(is_sold=True)

            return Response(
                {"message": "Checkout successful"}, status=status.HTTP_200_OK
            )
