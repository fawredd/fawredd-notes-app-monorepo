/**
 * Custom error handling middleware.
 * It logs the error and sends a structured JSON response.
 */
function errorHandler(err, req, res, next) {
  // Log the error details for debugging
  console.error(err);

  // Default to 500 Internal Server Error if status code is not set
  const statusCode = err.statusCode || 500;
  
  const response = {
    error: err.message || 'Internal Server Error',
  };

  // Optionally include error details in development
  if (process.env.NODE_ENV !== 'production') {
    response.details = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = { errorHandler }