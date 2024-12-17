from django.contrib import admin
from userauths.models import User, Profile
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Customize UserAdmin to display custom fields and enhance search/filter functionality
class UserAdmin(BaseUserAdmin):
    # Display email, username, and verification status in the admin list view
    list_display = ['email', 'username', 'is_verified']
    # Allow searching by email and username for convenience
    search_fields = ['email', 'username']
    # Filter by verification status
    list_filter = ['is_verified']
    # Define fields to display in the user detail view
    fieldsets = BaseUserAdmin.fieldsets + (
        (None, {'fields': ('otp', 'refresh_token', 'is_verified')}),
    )

# Customize ProfileAdmin for enhanced Profile management in the admin panel
class ProfileAdmin(admin.ModelAdmin):
    # Display user, image, location, and date of profile creation
    list_display = ['user', 'date']
    # Search by user's username and location
    search_fields = ['user__username']
    # Filter by profile creation date
    list_filter = ['date']

# Register the customized admin classes
admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
