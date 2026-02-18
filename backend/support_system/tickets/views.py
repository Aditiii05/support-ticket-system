#from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Avg
from django.utils import timezone
from datetime import timedelta
import openai
import os
from .models import Ticket
from .serializers import TicketSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        priority = self.request.query_params.get('priority')
        status_filter = self.request.query_params.get('status')
        search = self.request.query_params.get('search')
        if category:
            queryset = queryset.filter(category=category)
        if priority:
            queryset = queryset.filter(priority=priority)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(description__icontains=search)
        return queryset

@api_view(['GET'])
def stats(request):
    total_tickets = Ticket.objects.count()
    open_tickets = Ticket.objects.filter(status='open').count()
    thirty_days_ago = timezone.now() - timedelta(days=30)
    recent_tickets = Ticket.objects.filter(created_at__gte=thirty_days_ago).count()
    avg_tickets_per_day = recent_tickets / 30 if recent_tickets > 0 else 0
    priority_breakdown = Ticket.objects.values('priority').annotate(count=Count('priority'))
    category_breakdown = Ticket.objects.values('category').annotate(count=Count('category'))
    return Response({
        'total_tickets': total_tickets,
        'open_tickets': open_tickets,
        'avg_tickets_per_day': round(avg_tickets_per_day, 1),
        'priority_breakdown': {item['priority']: item['count'] for item in priority_breakdown},
        'category_breakdown': {item['category']: item['count'] for item in category_breakdown},
    })

@api_view(['POST'])
def classify(request):
    description = request.data.get('description')
    if not description:
        return Response({'error': 'Description required'}, status=400)
    try:
        openai.api_key = os.getenv('OPENAI_API_KEY')
        prompt = f"Categorize this support ticket description into one of: billing, technical, account, general. Also suggest a priority: low, medium, high, critical. Description: {description}"
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=50
        )
        result = response.choices[0].message.content.strip()
        lines = result.split('\n')
        category = lines[0].split(': ')[1] if len(lines) > 0 else 'general'
        priority = lines[1].split(': ')[1] if len(lines) > 1 else 'medium'
        return Response({'suggested_category': category, 'suggested_priority': priority})
    except Exception as e:
        return Response({'suggested_category': 'general', 'suggested_priority': 'medium'}, status=200)