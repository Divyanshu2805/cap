from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from userauths.models import Profile, User

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer to include additional fields in JWT payload.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add additional fields to the token payload
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email
        token['username'] = user.username

        return token

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration with password validation.
    """
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'password2']

    def validate(self, attrs):
        """
        Validate if the two password fields match.
        """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        """
        Create and return a new User instance, with an email-based username.
        """
        user = User(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email']
        )
        
        # Generate username from email prefix
        email_username, _ = validated_data['email'].split("@", 1)
        user.username = email_username

        # Set the password for the user
        user.set_password(validated_data['password'])
        user.save()

        return user

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user details, including all fields.
    """
    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ('is_verified',)  # Mark fields like is_verified as read-only

class ProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for Profile model, including all fields.
    """
    class Meta:
        model = Profile
        fields = '__all__'
