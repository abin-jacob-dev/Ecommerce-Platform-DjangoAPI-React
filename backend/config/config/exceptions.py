from rest_framework.views import exception_handler
from rest_framework.response import Response

# def custom_exception_handler(exc, context):
#     response = exception_handler(exc, context)
#     if response is not None:
#         response.data = {
#             "success": False,
#             # "message": "An error occurred",
#             "message": response,
#             "error": response.data,
#         }
#         return response
#     return response


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return None

    error_data = response.data
    message = (
        error_data.get("detail", "An error occurred")
        if isinstance(error_data, dict)
        else "An error occurred"
    )

    response.data = {
        "success": False,
        "message": str(message),
        "error": error_data,
    }
    return response
