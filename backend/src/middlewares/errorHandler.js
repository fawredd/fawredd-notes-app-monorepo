const process = require("node:process")
/**
 * Custom error handling middleware.
 * It logs the error and sends a structured JSON response.
 * @param {Error} err - The error object
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
function errorHandler(err, req, res) {
  // Log the error details for debugging
  console.error(err)

  // Default to 500 Internal Server Error if status code is not set
  const statusCode = err.statusCode || 500

  const response = {
    error: err.message || "Internal Server Error",
  }

  // Optionally include error details in development
  if (process.env.NODE_ENV !== "production") {
    response.details = err.stack
  }

  res.status(statusCode).json(response)
}

module.exports = { errorHandler }
