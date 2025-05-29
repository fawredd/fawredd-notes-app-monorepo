const express = require("express")
const noteController = require("../controllers/noteController")
const router = express.Router()

router.post("/", noteController.handleCreateNote)
router.get("/", noteController.handleGetAllNotes)
router.get("/:id", noteController.handleGetNoteById)
router.put("/:id", noteController.handleUpdateNote)
router.delete("/:id", noteController.handleDeleteNote)

module.exports = router
