export const API_MESSAGES = {
  SUCCESS: {
    DEFAULT: "Operation completed successfully.",
    LOGIN: "Login successful.",
    REGISTER: "Account created successfully.",
    UPDATE: "Updated successfully.",
    DELETE: "Deleted successfully.",
    LOGOUT: "Logged out successfully.",
  },

  ERROR: {
    400: "Please check the information you entered.",
    401: "Invalid email/username or password.",
    403: "You don't have permission to perform this action.",
    404: "The requested resource could not be found.",
    409: "This resource already exists.",
    422: "Please correct the highlighted fields.",
    429: "Too many requests. Please try again later.",
    500: "Something went wrong. Please try again later.",
    502: "Service temporarily unavailable.",
    503: "Service temporarily unavailable.",
    504: "Request timed out. Please try again.",
  },
};
