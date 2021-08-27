from django.db import models

# Create your models here.


class Users(models.Model):
    username = models.TextField()
    first_name = models.TextField()
    last_name = models.TextField()
    receiving_bonuses = models.BooleanField()
    avatar = models.URLField()
    Access = models.BooleanField(default=False)


class ReceivedBonuses(models.Model):
    username = models.TextField()
    bonus_admin = models.IntegerField()
    bonus_colleague = models.IntegerField()
    receiving_bonuses = models.BooleanField()


class BonusesWithComments(models.Model):
    username_who_received = models.TextField()
    username_who_sent = models.TextField()
    bonus = models.IntegerField()
    comment = models.TextField()
    date = models.TextField()
    anonymous = models.BooleanField(default=False)
    real_name_who_received = models.TextField()
    real_name_who_sent = models.TextField()


class ShiftForBonuses(models.Model):
    admin_username = models.TextField()
    start_time = models.TextField()
    end_time = models.TextField()
    accrued_bonuses = models.IntegerField()
