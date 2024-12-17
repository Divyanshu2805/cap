from django.shortcuts import render
from django.http import JsonResponse
import requests
from .forms import ChatForm
from .models import ChatMessage

# FastAPI URL where the RAG pipeline is hosted
FASTAPI_URL = 'http://localhost:8000/rag/'

def chat(request):
    form = ChatForm(request.POST or None)
    response = None
    if form.is_valid():
        user_message = form.cleaned_data['user_message']
        params = {"question": user_message}
        # Send the question to FastAPI endpoint
        try:
            api_response = requests.post(FASTAPI_URL, params=params)
            if api_response.status_code == 200:
                response = api_response.json().get('answer')
                # Optionally store the chat history
                ChatMessage.objects.create(user_message=user_message, response=response)
        except Exception as e:
            response = f"Error: {str(e)}"
    
    return render(request, 'chat/chat.html', {'form': form, 'response': response})
