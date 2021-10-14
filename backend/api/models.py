from django.db import models
from django.db.models import Count, Max, Sum
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    max_amount = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return self.username

    class Meta:
        ordering = ['id']

    def autobid_spending(self, item):
        spending = self.autobids.exclude(item=item).aggregate(total=Sum('current_spending'))

        return spending['total']


class Item(models.Model):
    title = models.CharField(max_length=500, null=False, blank=False)
    thumbnail = models.FileField(blank=True, null=True)
    description = models.TextField(null=True, blank=True)
    closing_time = models.DateTimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Items"
        ordering = ['-id']

    def __str__(self):
        return self.title

    def highest_bid(self):
        max = self.bids.aggregate(Max('bid'))
        if max['bid__max'] != None:
            return max['bid__max']
        return 0

    def highest_bid_record(self):
        max = self.bids.aggregate(max_bid=Max('bid'))['max_bid']
        bid = Bid.objects.get(bid=max, item=self)
        return bid


class Autobid(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='autobids')
    bidder = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='autobids')

    current_spending = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Auto Bids"
        ordering = ['-id']

    def __str__(self):
        return self.item.title + ' - User: ' + self.bidder.username


class Bid(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='bids')
    bidder = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bids')
    bid = models.PositiveIntegerField(null=False, blank=False, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Bids"
        ordering = ['-created_at']
        unique_together = ['item', 'bid']

    def __str__(self):
        return self.item.title + ' - ' +  str(self.bid)


