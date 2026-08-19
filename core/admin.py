from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "email",
        "company",
        "subject",
        "created_at",
    )

    search_fields = (
        "name",
        "email",
        "company",
        "subject",
        "message",
    )

    list_filter = (
        "created_at",
    )

    readonly_fields = (
        "created_at",
    )