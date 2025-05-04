from rest_framework import serializers
from .models import Category, Product, Transaction


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "sku",
            "barcode",
            "category",
            "category_name",
            "price",
            "cost_price",
            "quantity",
            "low_stock_threshold",
            "is_low_stock",
            "created_at",
            "updated_at",
        ]


class TransactionSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = Transaction
        fields = [
            "id",
            "product",
            "product_name",
            "quantity",
            "transaction_type",
            "transaction_date",
            "notes",
        ]
