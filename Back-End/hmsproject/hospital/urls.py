from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, DoctorViewSet, AppointmentViewSet, dashboard

router = DefaultRouter()
router.register("patients", PatientViewSet)
router.register("doctors", DoctorViewSet)
router.register("appointments", AppointmentViewSet)

urlpatterns = [
    path("dashboard/", dashboard),
    path("", include(router.urls)),
]
