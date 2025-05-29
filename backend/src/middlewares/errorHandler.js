const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  res.status(404).json({ error: err.message })
}

module.exports = errorHandler