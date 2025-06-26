const { z } = require('zod')
const AppError = require('../utils/appError')

/**
 * Higher-Order Function to validate request data using a Zod schema.
 * @param {import('zod').ZodSchema} schema - The Zod schema to use for validation.
 * @param {'body' | 'query' | 'params'} source - The source of the data in the request (req.body, req.query, or req.params).
 * @returns {Function} An Express middleware function.
 */
const validateUserData =
  (schema, source = 'body') =>
  (req, res, next) => {
    // Only allow specific sources to prevent object injection
    const allowedSources = ['body', 'query', 'params']
    if (!allowedSources.includes(source)) {
      return next(new AppError('Invalid data source for validation', 500))
    }

    // eslint-disable-next-line security/detect-object-injection -- source is validated above
    const dataToValidate = req[source]

    const result = schema.safeParse(dataToValidate)

    if (!result.success) {
      // Pass the ZodError directly to the error handling middleware
      const errors = result.error.errors.map((err) => ({
        path: Array.isArray(err.path) ? err.path.join('.') : err.path,
        message: err.message,
      }))
      return next(new AppError('Datos de entrada inválidos', 400, errors))
    }

    // eslint-disable-next-line security/detect-object-injection -- source is validated above
    req[source] = result.data

    next()
  }

// Define Zod schemas here (or import them )
const userSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).trim(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).trim(),
  userName: z.string().trim(),
  role: z.enum(['user', 'admin']).default('user'),
})

const userIdSchema = z.object({ id: z.string().uuid('Invalid user ID format') })

module.exports = {
  validateUserData,
  userSchema,
  userIdSchema,
}
