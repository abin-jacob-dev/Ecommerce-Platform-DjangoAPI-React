from django.urls import path
from .views import (
    ProductListCreateAPIView,
    ProductDetailAPIView,
    MyProductsAPIView,
    CheckoutAPIView,
)

urlpatterns = [
    path("products/", ProductListCreateAPIView.as_view(), name="products-list-create"),
    path("products/<int:pk>/", ProductDetailAPIView.as_view(), name="product-detail"),
    path("my_products/", MyProductsAPIView.as_view(), name="my-products"),
    path("checkout/", CheckoutAPIView.as_view(), name="checkout"),
]
