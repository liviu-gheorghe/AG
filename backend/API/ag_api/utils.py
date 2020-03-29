import datetime
from math import floor


def time_posted(instance):
    return instance.datetime_posted.strftime("%H:%M")


def date_posted(instance):
    return instance.datetime_posted.strftime("%d/%m/%Y")


def is_recent(instance):
    delta = datetime.datetime.now() - instance.datetime_posted
    return delta.days == 0


def is_recent_date_posted(instance):
    if not is_recent(instance):
        return None
    delta = datetime.datetime.now() - instance.datetime_posted
    delta_seconds = delta.seconds
    if floor(delta_seconds/3600):
        return "{} {}".format(
            floor(delta.seconds/3600),
            "ora" if floor(delta.seconds/3600) == 1 else "ore"
        )
    elif floor(delta_seconds/60):
        return "{} {}".format(
            floor(delta_seconds/60),
            "minut" if floor(delta.seconds/60) == 1 else "minute"
        )
    return "{} {}".format(
        floor(delta_seconds),
        "secunda" if floor(delta_seconds) == 1 else "secunde"
    )