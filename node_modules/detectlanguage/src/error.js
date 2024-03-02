class DetectLanguageError extends Error {}

function handleError(error) {
  const message = error?.response?.data?.error?.message || error.message;
  const apiError = new DetectLanguageError(message);

  apiError.stack = error.stack;

  throw apiError;
}

export {
  DetectLanguageError,
  handleError,
};
