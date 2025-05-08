from functools import wraps

from django.db import IntegrityError
from django.http import Http404

from rest_framework import status
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from rest_framework.response import Response

def safe_operation(func):
    @wraps(func)
    def wrapper(self, request, *args, **kwargs):
        try:
            return func(self, request, *args, **kwargs)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError:
            return Response({"detail": "Database integrity error occurred."}, status=status.HTTP_400_BAD_REQUEST)
        except PermissionDenied:
            return Response({"detail": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
        except NotFound:
            return Response({"detail": "Requested resource was not found."}, status=status.HTTP_404_NOT_FOUND)
        except Http404:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        except KeyError as e:
            return Response({"detail": f"Missing key: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except TypeError as e:
            return Response({"detail": f"Invalid type: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except AttributeError as e:
            return Response({"detail": f"Missing attribute: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return wrapper