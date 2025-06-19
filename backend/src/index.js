require("dotenv").config()
const express = require("express")
const cors = require("cors") 
const userRoutes = require("./routes/userRoutes") // Import user routes
const noteRoutes = require("./routes/noteRoutes") // Import note routes
const errorHandler = require("./middlewares/errorHandler") // Import error handler middleware
const AppError = require("./utils/apperror") // Import custom error class

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors()) // Enable CORS for all routes
app.use(express.json()) 

// API Routes
app.use("/api/users", userRoutes)
app.use("/api/notes", noteRoutes) // Use note routes for /api/notes path
app.all('*', (req, res,next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this
     server`, 404))
})

// Error handler middleware
app.use(errorHandler)

async function main() {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`)
  })
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
