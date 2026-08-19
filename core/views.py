import os
import json

from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from .models import ContactMessage

from google import genai
from google.genai import types


# =========================================================
# NORMAL PAGE VIEWS
# =========================================================

def home(request):
    return render(request, "home.html")


def about(request):
    return render(request, "about.html")


def projects(request):
    return render(request, "projects.html")



def contact(request):

    success = False

    if request.method == "POST":

        name = request.POST.get("name")
        email = request.POST.get("email")
        company = request.POST.get("company")
        subject = request.POST.get("subject")
        message = request.POST.get("message")

        ContactMessage.objects.create(
            name=name,
            email=email,
            company=company,
            subject=subject,
            message=message,
        )

        success = True

    return render(
        request,
        "contact.html",
        {
            "success": success
        }
    )

# =========================================================
# VIRTUALINDU PORTFOLIO INFORMATION
# =========================================================

PORTFOLIO = """
Name: Induja R

Role: Python Full Stack Developer

Profile:
Induja is a Python Full Stack Developer with hands-on experience
in Python, Django, Django REST Framework, SQL, JavaScript and React.

Technical Skills:
Python, Django, Django REST Framework, JavaScript, React,
HTML, CSS, SQL, SQLite, PostgreSQL, Django ORM, Git, GitHub,
VS Code, REST APIs, Responsive Web Design, Render and Vercel.

Professional Experience:

1. Python Full Stack Developer Trainee / Intern
Vetri IT Solutions
2026

Completed hands-on full-stack training in Python, Django,
Django REST Framework, SQL, JavaScript, React, HTML and CSS.

Worked with forms, authentication, CRUD workflows,
database integration, REST APIs, Git, GitHub, Render and Vercel.

2. Python Trainer & Computer Science Teacher
Muthamil Public School
February 2020 – June 2021

Taught Python programming to Grade 11 students.
Also taught Computer Science and digital literacy to Grades 7–10.

3. Robotics Trainer
Pushpalatha Vidya Mandir
July 2018 – January 2020

Delivered robotics and STEM training for Grades 5–8
using coding and LEGO EV3.

Education:

B.E. Computer Science Engineering
Dr. Sivanthi Aditanar College of Engineering, Thiruchendur
2014 – 2018
75%, First Class, Semester Topper.

Projects:

FoodFlow:
Food delivery web application built using React, JavaScript,
HTML and CSS.

Features:
Restaurant browsing, menu, cart, checkout,
order tracking, profile and order history.

PayGen:
Payroll and payslip web application built using JavaScript,
HTML and CSS.

Features:
Payslip generation, payslip history and payslip preview.

UrbanNest:
Responsive website created from a Figma prototype.
Built using HTML, CSS and JavaScript.

Event Management Website:
Django and Python based website with event listing,
enquiry/booking workflows, Django forms, models
and database-backed CRUD functionality.

Parlour Booking Website:
Booking-focused web application for a parlour/salon
workflow with customer-facing pages and Django functionality.

GroCo Grocery Website:
Responsive grocery and organic-produce website
focused on modern UI and user-friendly product presentation.

Current Focus:
Python Full Stack Development, Django, Django REST Framework,
React, JavaScript, SQL, REST APIs, deployment and
modern responsive web development.
"""


# =========================================================
# LOCAL ANSWERS
# These make sure common questions NEVER return the same answer
# =========================================================

def get_local_answer(question):
    q = question.lower().strip()

    # ABOUT / INTRODUCTION
    if any(word in q for word in [
        "who is induja",
        "who is indu",
        "tell me about induja",
        "tell me about her",
        "about induja",
        "about her",
        "introduce induja",
        "introduce her"
    ]):
        return (
            "Induja R is a Python Full Stack Developer with hands-on "
            "experience in Python, Django, Django REST Framework, "
            "SQL, JavaScript and React. She has built several web "
            "applications and also has experience as a Python trainer "
            "and computer science teacher."
        )

    # SKILLS
    if any(word in q for word in [
        "skills",
        "technical skills",
        "technologies",
        "technology",
        "tech stack",
        "what can she do",
        "what technologies"
    ]):
        return (
            "Induja works with Python, Django, Django REST Framework, "
            "JavaScript, React, HTML, CSS and SQL. She also has "
            "experience with REST APIs, Django ORM, Git, GitHub, "
            "PostgreSQL, SQLite, Render and Vercel."
        )

    # EDUCATION
    if any(word in q for word in [
        "education",
        "degree",
        "college",
        "university",
        "qualification",
        "studied",
        "b.e",
        "engineering"
    ]):
        return (
            "Induja completed her B.E. in Computer Science Engineering "
            "from Dr. Sivanthi Aditanar College of Engineering, "
            "Thiruchendur, from 2014 to 2018. She graduated with "
            "75%, First Class, and was a Semester Topper."
        )

    # EXPERIENCE
    if any(word in q for word in [
        "experience",
        "work experience",
        "worked",
        "career",
        "previous job",
        "professional experience"
    ]):
        return (
            "Induja has experience as a Python Full Stack Developer "
            "Trainee/Intern at Vetri IT Solutions in 2026. She also "
            "worked as a Python Trainer and Computer Science Teacher "
            "at Muthamil Public School from February 2020 to June 2021, "
            "and as a Robotics Trainer at Pushpalatha Vidya Mandir "
            "from July 2018 to January 2020."
        )

    # PYTHON
    if "python" in q:
        return (
            "Python is one of Induja's main technologies. She has used "
            "Python with Django and Django REST Framework to build "
            "web applications, CRUD workflows, APIs and database-driven "
            "projects."
        )

    # DJANGO
    if "django" in q:
        return (
            "Induja has hands-on experience with Django and Django REST "
            "Framework. She has used Django models, forms, ORM, CRUD "
            "operations, database integration and REST APIs in her projects."
        )

    # REACT
    if "react" in q:
        return (
            "Induja has experience with React for building responsive "
            "and interactive web interfaces. She used React in projects "
            "such as FoodFlow."
        )

    # SQL / DATABASE
    if any(word in q for word in [
        "sql",
        "database",
        "postgresql",
        "sqlite",
        "orm"
    ]):
        return (
            "Induja has experience with SQL, SQLite, PostgreSQL and "
            "Django ORM. She has worked with database integration and "
            "CRUD operations in Django-based applications."
        )

    # FOODFLOW
    if any(word in q for word in [
        "foodflow",
        "food flow",
        "food delivery"
    ]):
        return (
            "FoodFlow is a food delivery web application built using "
            "React, JavaScript, HTML and CSS. It includes restaurant "
            "browsing, menus, cart, checkout, order tracking, profiles "
            "and order history."
        )

    # PAYGEN
    if any(word in q for word in [
        "paygen",
        "pay gen",
        "payroll",
        "payslip"
    ]):
        return (
            "PayGen is a payroll and payslip web application built using "
            "JavaScript, HTML and CSS. It includes payslip generation, "
            "payslip history and payslip preview."
        )

    # URBANNEST
    if any(word in q for word in [
        "urbannest",
        "urban nest"
    ]):
        return (
            "UrbanNest is a responsive website created from a Figma "
            "prototype. It was built using HTML, CSS and JavaScript."
        )

    # EVENT MANAGEMENT
    if any(word in q for word in [
        "event management",
        "event website",
        "event project"
    ]):
        return (
            "Induja built a Django and Python based Event Management "
            "Website with event listing, enquiry and booking workflows, "
            "Django forms, models and database-backed CRUD functionality."
        )

    # PARLOUR
    if any(word in q for word in [
        "parlour",
        "salon",
        "parlour booking"
    ]):
        return (
            "The Parlour Booking Website is a booking-focused web "
            "application for a salon workflow, with customer-facing "
            "pages and Django functionality."
        )

    # GROCO
    if any(word in q for word in[
        "groco",
        "grocery",
        "organic produce"
    ]):
        return (
            "GroCo is a responsive grocery and organic-produce website "
            "focused on modern UI and user-friendly product presentation."
        )

    # HIRING
    if any(word in q for word in [
        "hire",
        "why should i hire",
        "why hire",
        "why choose",
        "strengths",
        "good developer"
    ]):
        return (
            "Induja combines full-stack development skills with hands-on "
            "project experience and teaching experience. She has worked "
            "with Django, React, SQL, REST APIs and deployment, and has "
            "experience building complete web applications."
        )

    # CURRENT FOCUS
    if any(word in q for word in [
        "currently",
        "current focus",
        "learning now",
        "what is she learning",
        "improving"
    ]):
        return (
            "Induja is currently improving her skills in Python Full Stack "
            "Development, Django, Django REST Framework, React, JavaScript, "
            "SQL, REST APIs, deployment and modern responsive web development."
        )

    # TEACHING
    if any(word in q for word in [
        "teacher",
        "teaching",
        "trainer",
        "training",
        "school"
    ]):
        return (
            "Induja has teaching and training experience. She taught Python "
            "and Computer Science at Muthamil Public School and also worked "
            "as a Robotics Trainer at Pushpalatha Vidya Mandir."
        )

    # GITHUB / DEPLOYMENT
    if any(word in q for word in [
        "github",
        "git",
        "deployment",
        "deploy",
        "render",
        "vercel"
    ]):
        return (
            "Induja has experience with Git and GitHub and has deployed "
            "web applications using Render and Vercel."
        )

    # GREETING
    if q in [
        "hi",
        "hello",
        "hey",
        "hai",
        "good morning",
        "good afternoon",
        "good evening"
    ]:
        return (
            "Hi! I'm VirtualINDU, Induja's portfolio assistant. "
            "You can ask me about her skills, education, experience "
            "or projects."
        )

    return None


# =========================================================
# VIRTUALINDU API
# =========================================================

@csrf_exempt
@require_POST
def virtualindu_api(request):

    try:
        data = json.loads(request.body)
        question = str(data.get("question", "")).strip()

        if not question:
            return JsonResponse({
                "success": False,
                "error": "Please enter a question."
            }, status=400)

        q = question.lower().strip()
        q_clean = q.replace("?", "").replace(".", "").strip()

        # =====================================================
        # LOCAL ANSWERS - THESE WORK EVEN IF GEMINI FAILS
        # =====================================================

        # NAME
        if (
            "your name" in q
            or "what is your name" in q
            or "who are you" in q
            or "who is virtualindu" in q
        ):
            answer = (
                "I'm VirtualINDU, the portfolio assistant for Induja. "
                "I can tell you about her skills, education, experience "
                "and projects."
            )

        # ABOUT INDUJA
        elif (
            "tell me about induja" in q
            or "about induja" in q
            or "tell me about her" in q
            or "who is induja" in q
            or q_clean in ["induja", "indu"]
        ):
            answer = (
                "Induja is a Python Full Stack Developer with a B.E. "
                "in Computer Science and Engineering. She has experience "
                "as a Python trainer and has worked with Python, Django, "
                "React, JavaScript and SQL."
            )

        # SKILLS
        elif (
            "skill" in q
            or "technology" in q
            or "technologies" in q
            or "technical" in q
            or "what can she do" in q
            or "what can induja do" in q
        ):
            answer = (
                "Induja's technical skills include Python, Django, "
                "Django REST Framework, JavaScript, React, HTML, CSS, "
                "SQL, Git, GitHub, REST APIs and responsive web design."
            )

        # EDUCATION
        elif (
            "education" in q
            or "study" in q
            or "degree" in q
            or "college" in q
            or "qualification" in q
            or "where did she study" in q
        ):
            answer = (
                "Induja completed her B.E. in Computer Science Engineering "
                "from Dr. Sivanthi Aditanar College of Engineering, "
                "Thiruchendur. She graduated in 2018 with 75%, First Class "
                "and was a Semester Topper."
            )

        # EXPERIENCE
        elif (
            "experience" in q
            or "worked" in q
            or "work experience" in q
            or "trainer" in q
            or "job" in q
        ):
            answer = (
                "Induja worked as a Python Trainer and Computer Science "
                "Teacher at Muthamil Public School from February 2020 to "
                "June 2021. She also worked as a Robotics Trainer at "
                "Pushpalatha Vidya Mandir and completed Python Full Stack "
                "training and internship at Vetri IT Solutions."
            )

        # PYTHON
        elif "python" in q:
            answer = (
                "Python is one of Induja's main technical skills. "
                "She has used Python with Django and Django REST Framework "
                "to build web applications and backend functionality."
            )

        # DJANGO
        elif "django" in q:
            answer = (
                "Induja has hands-on experience with Django, including "
                "models, forms, CRUD operations, authentication, database "
                "integration and REST API development."
            )

        # REACT
        elif "react" in q:
            answer = (
                "Induja has worked with React to build responsive and "
                "interactive web applications, including the FoodFlow "
                "food delivery project."
            )

        # SQL / DATABASE
        elif (
            "sql" in q
            or "database" in q
            or "postgresql" in q
            or "sqlite" in q
        ):
            answer = (
                "Induja has experience with SQL and database technologies "
                "including SQLite and PostgreSQL. She has worked with "
                "database integration and Django ORM."
            )

        # FOODFLOW
        elif (
            "foodflow" in q
            or "food flow" in q
            or "food delivery" in q
        ):
            answer = (
                "FoodFlow is a food delivery web application built using "
                "React, JavaScript, HTML and CSS. It includes restaurant "
                "browsing, menus, cart, checkout, order tracking, profiles "
                "and order history."
            )

        # PAYGEN
        elif (
            "paygen" in q
            or "pay gen" in q
            or "payroll" in q
            or "payslip" in q
        ):
            answer = (
                "PayGen is a payroll and payslip web application. "
                "It includes payslip generation, payslip history and "
                "payslip preview, and was built using JavaScript, HTML "
                "and CSS."
            )

        # URBANNEST
        elif (
            "urbannest" in q
            or "urban nest" in q
        ):
            answer = (
                "UrbanNest is a responsive website created from a Figma "
                "prototype. It was built using HTML, CSS and JavaScript."
            )

        # PROJECTS
        elif "project" in q or "projects" in q:
            answer = (
                "Induja has worked on several projects including FoodFlow, "
                "a food delivery application; PayGen, a payroll application; "
                "UrbanNest, a responsive website; and Django-based event "
                "management and booking applications."
            )

        # HIRE
        elif (
            "hire" in q
            or "why should i hire" in q
            or "why hire" in q
        ):
            answer = (
                "Induja combines full-stack development skills with practical "
                "project experience and teaching experience. She has worked "
                "with Python, Django, React, SQL, REST APIs and deployment, "
                "and has built complete web applications."
            )

        # CURRENT FOCUS
        elif (
            "currently" in q
            or "learning" in q
            or "improving" in q
            or "current focus" in q
        ):
            answer = (
                "Induja is currently improving her skills in Python Full "
                "Stack Development, Django, Django REST Framework, React, "
                "JavaScript, SQL, REST APIs, deployment and modern "
                "responsive web development."
            )

        # =====================================================
        # GEMINI FOR OTHER QUESTIONS
        # =====================================================
        else:

            api_key = os.environ.get("GEMINI_API_KEY")

            if api_key:

                try:

                    client = genai.Client(
                        api_key=api_key
                    )

                    system_instruction = """
You are VirtualINDU, the portfolio assistant for Induja.

Answer the visitor's actual question.

Only use the portfolio information provided below.

Be concise and professional.

Do not give the same answer to every question.

Do not invent qualifications, companies, projects or experience.

PORTFOLIO:

Name: Induja R

Role: Python Full Stack Developer

Skills:
Python, Django, Django REST Framework, JavaScript, React,
HTML, CSS, SQL, SQLite, PostgreSQL, Django ORM, Git, GitHub,
REST APIs, Responsive Web Design, Render and Vercel.

Education:
B.E. Computer Science Engineering,
Dr. Sivanthi Aditanar College of Engineering, Thiruchendur.
2014-2018, 75%, First Class, Semester Topper.

Experience:
Python Full Stack Developer Trainee / Intern at Vetri IT Solutions.
Python Trainer & Computer Science Teacher at Muthamil Public School.
Robotics Trainer at Pushpalatha Vidya Mandir.

Projects:
FoodFlow - food delivery application.
PayGen - payroll and payslip application.
UrbanNest - responsive website from Figma.
Event Management Website - Django/Python.
Parlour Booking Website.
GroCo Grocery Website.

If the question is unrelated to Induja, say:
"I'm VirtualINDU, Induja's portfolio assistant. I can help with
questions about her skills, education, experience and projects."
"""

                    response = client.models.generate_content(
                        model="gemini-2.5-flash-lite",
                        contents=question,
                        config=types.GenerateContentConfig(
                            system_instruction=system_instruction,
                            max_output_tokens=250
                        )
                    )

                    answer = (response.text or "").strip()

                except Exception as e:

                    print("GEMINI ERROR:", repr(e))

                    answer = (
                        "I'm VirtualINDU, Induja's portfolio assistant. "
                        "I can help with her skills, education, experience "
                        "and projects."
                    )

            else:

                answer = (
                    "I'm VirtualINDU, Induja's portfolio assistant. "
                    "I can help with her skills, education, experience "
                    "and projects."
                )

        print("QUESTION:", question)
        print("ANSWER:", answer)

        return JsonResponse({
            "success": True,
            "answer": answer
        })

    except json.JSONDecodeError:

        return JsonResponse({
            "success": False,
            "error": "Invalid request."
        }, status=400)

    except Exception as e:

        print("VIRTUALINDU ERROR:", repr(e))

        return JsonResponse({
            "success": False,
            "error": str(e)
        }, status=500)