from django.contrib import admin
from .models import Category, Product, Transaction


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "sku", "category", "price", "quantity", "is_low_stock")
    list_filter = ("category", "created_at")
    search_fields = ("name", "description", "sku", "barcode")
    readonly_fields = ("created_at", "updated_at")


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("product", "quantity", "transaction_type", "transaction_date")
    list_filter = ("transaction_type", "transaction_date")
    search_fields = ("product__name", "notes")
    readonly_fields = ("transaction_date",)
