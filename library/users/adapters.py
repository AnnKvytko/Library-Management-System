from allauth.socialaccount.adapter import DefaultSocialAccountAdapter

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        extra_data = sociallogin.account.extra_data
        user.username = extra_data.get('name', user.username)
        user.email = extra_data.get('email', user.email)
        selected_role = (
            request.session.get('selected_role') or
            request.GET.get('role') or
            request.POST.get('role') or
            'guest'
        )
        user.role = selected_role

        user.save()
        return user
