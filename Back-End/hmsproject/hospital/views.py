from django.utils import timezone
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Patient, Doctor, Appointment
from .serializers import PatientSerializer, DoctorSerializer, AppointmentSerializer

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all().order_by("-time")
    serializer_class = AppointmentSerializer

@api_view(["GET"])
def dashboard(request):
    today = timezone.localdate()
    recent = Appointment.objects.order_by("-time")[:5]
    return Response({
        "total_patients": Patient.objects.count(),
        "available_doctors": Doctor.objects.filter(available=True).count(),
        "appointments_today": Appointment.objects.filter(time__date=today).count(),
        "recent": AppointmentSerializer(recent, many=True).data,
    })