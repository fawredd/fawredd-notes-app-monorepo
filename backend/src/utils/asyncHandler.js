/**
 * A higher-order function to wrap async middleware and catch errors.
 * It passes errors to the next middleware in the Express chain.
 * @param {Function} fn The async function to execute.
 * @returns {Function} An Express middleware function.
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}    

module.exports = asyncHandler