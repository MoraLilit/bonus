# Create your views here.

from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Users, ReceivedBonuses, BonusesWithComments, ShiftForBonuses
import datetime


def index(request):
    add_new_user_to_db(request)
    context = get_context(request)
    return render(request, 'index.html', context)


def login(request):
    return render(request, 'registration/login.html')


def get_context(request):
    chosen_user = Users.objects.get(username=request.user.username)
    all_users = Users.objects.filter(receiving_bonuses=True)
    general_bonuses = ReceivedBonuses.objects.get(username=request.user.username)
    received_bonuses = BonusesWithComments.objects.filter(username_who_received=request.user.username)
    sent_bonuses = BonusesWithComments.objects.filter(username_who_sent=request.user.username)
    a = 0
    for i in received_bonuses:
        a += i.bonus
    sum_bonus = a
    shift = ShiftForBonuses.objects.all()
    context = {
        "chosen_user": chosen_user,
        "all_users": all_users,
        "general_bonuses": general_bonuses,
        "received_bonuses": received_bonuses,
        "sent_bonuses": sent_bonuses,
        "current_user_bonus": sum_bonus,
        "shift": shift,
    }
    return context


# Adding a new user to table Users, if exist - ignore, if not - login again
def add_new_user_to_db(request):
    if request.user.is_authenticated:
        if not Users.objects.filter(username=request.user.username).exists():
            username = request.user.username
            first_name = request.user.first_name
            last_name = request.user.last_name
            ReceivedBonuses(username=username, bonus_admin=0,
                            bonus_colleague=0, receiving_bonuses=True).save()
            Users(username=username, first_name=first_name,
                  last_name=last_name, receiving_bonuses=True,
                  avatar='none', Access=False).save()


@csrf_exempt
def save(request):
    try:
        data = json.loads(request.POST.get('users_with_bonuses'))

        for users_with_bonuses in data:
            username_who_received = data[users_with_bonuses][0]
            anonymous = data[users_with_bonuses][4]
            username_who_sent = request.user.username
            real_name_who_received = data[users_with_bonuses][1]
            bonus = data[users_with_bonuses][2]
            comment = data[users_with_bonuses][3]
            real_name_who_sent = data[users_with_bonuses][5]
            date = datetime.date.today()
            # Add BonusesWithComments
            new_user_with_bonus = BonusesWithComments(username_who_received=username_who_received,
                                                      username_who_sent=username_who_sent, bonus=bonus,
                                                      comment=comment, date=date, anonymous=anonymous,
                                                      real_name_who_received=real_name_who_received,
                                                      real_name_who_sent=real_name_who_sent)
            new_user_with_bonus.save()
            # general_bonuses = ReceivedBonuses.objects.get(username=username_who_received)
            # colleague_quantity_of_bonus_id = general_bonuses.id
            # colleague_quantity_of_bonus = general_bonuses.bonus_colleague
            # admin_quantity_of_bonus = general_bonuses.bonus_admin
            '''ReceivedBonuses(id=colleague_quantity_of_bonus_id, username=username_who_received, 
                            bonus_admin=admin_quantity_of_bonus, 
                            bonus_colleague=int(colleague_quantity_of_bonus)+int(bonus)).save()'''
        # Update ReceivedBonuses
        general_bonuses = ReceivedBonuses.objects.get(username=request.user.username)
        general_bonuses.bonus_admin = 0
        general_bonuses.save()
        return HttpResponse('Success')
    except TypeError:
        return HttpResponse('Json...again...Here?')


@csrf_exempt
def admin_bonus(request):
    try:
        data = json.loads(request.POST.get('admin_bonus'))
        ReceivedBonuses.objects.filter(receiving_bonuses=True).update(bonus_admin=int(data['admin_bonus']))
        return HttpResponse('Success')
    except Exception as e:
        return HttpResponse(e)


@csrf_exempt
def receive_bonus(request):
    try:
        data = json.loads(request.POST.get('receiveBonus'))
        general_bonuses = Users.objects.get(username=request.user.username)
        temporary = ReceivedBonuses.objects.get(username=request.user.username)
        general_bonuses.receiving_bonuses = data['receiveBonus']
        temporary.receiving_bonuses = data['receiveBonus']
        if not data['receiveBonus']:
            temporary.bonus_admin = 0
        general_bonuses.save()
        temporary.save()
        return HttpResponse('Success')
    except TypeError:
        return HttpResponse('Json...again...')
