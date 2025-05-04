from django.shortcuts import render
from django.db import models
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, Transaction
from .serializers import CategorySerializer, ProductSerializer, TransactionSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "description"]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["category", "is_low_stock"]
    search_fields = ["name", "description", "sku", "barcode"]
    ordering_fields = ["name", "price", "quantity", "created_at"]

    @action(detail=False, methods=["get"])
    def low_stock(self, request):
        low_stock_products = Product.objects.filter(
            quantity__lte=models.F("low_stock_threshold")
        )
        serializer = self.get_serializer(low_stock_products, many=True)
        return Response(serializer.data)


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by("-transaction_date")
    serializer_class = TransactionSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["product", "transaction_type"]
    ordering_fields = ["transaction_date", "quantity"]

    @action(detail=False, methods=["get"])
    def by_product(self, request, pk=None):
        product_id = request.query_params.get("product_id")
        if product_id:
            transactions = Transaction.objects.filter(product_id=product_id)
            serializer = self.get_serializer(transactions, many=True)
            return Response(serializer.data)
        return Response({"error": "Product ID is required"}, status=400)
