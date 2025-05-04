from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    sku = models.CharField(max_length=50, unique=True)
    barcode = models.CharField(max_length=50, blank=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name="products"
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=0)
    low_stock_threshold = models.IntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def is_low_stock(self):
        return self.quantity <= self.low_stock_threshold


class Transaction(models.Model):
    TRANSACTION_TYPES = (
        ("purchase", "Purchase"),
        ("sale", "Sale"),
        ("return", "Return"),
        ("adjustment", "Adjustment"),
    )

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="transactions"
    )
    quantity = models.IntegerField()
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    transaction_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.product.name} ({self.quantity})"

    def save(self, *args, **kwargs):
        # Update the product quantity based on transaction type
        if self.transaction_type == "purchase":
            self.product.quantity += self.quantity
        elif self.transaction_type == "sale":
            self.product.quantity -= self.quantity
        elif self.transaction_type == "return":
            self.product.quantity += self.quantity
        elif self.transaction_type == "adjustment":
            # For adjustments, quantity can be positive or negative
            pass

        self.product.save()
        super().save(*args, **kwargs)
