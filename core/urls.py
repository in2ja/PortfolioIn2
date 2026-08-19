from django.urls import path
from . import views


urlpatterns = [

    path("", views.home, name="home"),

    path("about/", views.about, name="about"),

    path("projects/", views.projects, name="projects"),

    path("contact/", views.contact, name="contact"),

    path(
        "api/virtualindu/",
        views.virtualindu_api,
        name="virtualindu_api"
    ),

]