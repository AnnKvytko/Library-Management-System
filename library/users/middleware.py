class StoreRoleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if 'role' in request.GET:
            request.session['selected_role'] = request.GET['role']
        return self.get_response(request)