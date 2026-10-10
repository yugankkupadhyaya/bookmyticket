export const SuccessResponseBody = {
  success: true,
  error: {},
  message: '',
  data: null,
};

export const ErrorResponseBody = {
  success: false,
  error: {},
  message: '',
  data: null,
};

export const successResponse = (message, data = null) => ({
  ...SuccessResponseBody,
  message,
  data,
});

export const errorResponse = (message, error = null, data = null) => ({
  ...ErrorResponseBody,
  error,
  message,
  data,
});
