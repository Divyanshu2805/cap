from django import forms

class ChatForm(forms.Form):
    user_message = forms.CharField(widget=forms.Textarea(attrs={'rows': 4, 'cols': 50}), label="Ask your question:")
