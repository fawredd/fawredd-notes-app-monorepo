require("dotenv").config()
const express = require("express")
const cors = require("cors") 
const noteRoutes = require("./routes/noteRoutes") // Import note routes
const errorHandler = require("./middlewares/errorHandler") // Import error handler middleware

const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors()) // Enable CORS for all routes
app.use(express.json()) 

// API Routes
app.use("/api/notes", noteRoutes) // Use note routes for /api/notes path

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "UP", message: "Backend is healthy!" })
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
