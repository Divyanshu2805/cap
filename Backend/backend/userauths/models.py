from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save


class User(AbstractUser):
    # Custom user model extending Django's AbstractUser
    username = models.CharField(unique=True, max_length=100)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    otp = models.CharField(max_length=6, null=True, blank=True)  # Optional OTP for 2FA or verification
    refresh_token = models.CharField(max_length=1000, null=True, blank=True)  # Optional token for session management
    is_verified = models.BooleanField(default=False)  # Field to track email verification status

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        # String representation returns the user's email
        return self.email


class Profile(models.Model):
    # Profile model linked to each User for additional info
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.FileField(upload_to="user_folder", default="default-user.jpg", null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)  # Stores when the profile was created

    def __str__(self):
        # String representation returns the username associated with the Profile
        return f"{self.user.username}'s Profile"


# Signal to create or save a Profile instance whenever a User instance is created or updated
def manage_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    else:
        instance.profile.save()


# Connect the signal to the User model post-save event
post_save.connect(manage_user_profile, sender=User)
