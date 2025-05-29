const noteService = require("../services/noteService")

  // Assuming req.body.tags is an array of strings like ["tag1", "tag2"]
async function handleCreateNote(req, res) {
  try {
    if (!req.body.title) {
      return res.status(400).json({ error: "Title is required" })
    }
    const note = await noteService.createNote(req.body)
    res.status(201).json(note)
  } catch (error) {
    console.error("Error creating note:", error)
    res
      .status(500)
      .json({ error: "Failed to create note", details: error.message })
  }
}

async function handleGetAllNotes(req, res) {
  try {
    const { archived, tag } = req.query
    const notes = await noteService.getAllNotes({ archived, tag })
    res.status(200).json(notes)
  } catch (error) {
    console.error("Error fetching notes:", error)
    res
      .status(500)
      .json({ error: "Failed to fetch notes", details: error.message })
  }
}

async function handleGetNoteById(req, res) {
  try {
    const note = await noteService.getNoteById(req.params.id)
    res.status(200).json(note)
  } catch (error) {
    console.error(`Error fetching note ${req.params.id}:`, error)
    if (error.message === "Note not found") {
      return res.status(404).json({ error: error.message })
    }
    res
      .status(500)
      .json({ error: "Failed to fetch note", details: error.message })
  }
}

async function handleUpdateNote(req, res) {
  try {
    const note = await noteService.updateNote(req.params.id, req.body)
    res.status(200).json(note)
  } catch (error) {
    console.error(`Error updating note ${req.params.id}:`, error)
    if (error.message.includes("Note not found")) {
      return res.status(404).json({ error: error.message })
    }
    res
      .status(500)
      .json({ error: "Failed to update note", details: error.message })
  }
}

async function handleDeleteNote(req, res) {
  try {
    await noteService.deleteNote(req.params.id)
    res.status(204).send()
  } catch (error) {
    console.error(`Error deleting note ${req.params.id}:`, error)
    if (error.message.includes("Note not found")) {
      return res.status(404).json({ error: error.message })
    }
    res
      .status(500)
      .json({ error: "Failed to delete note", details: error.message })
  }
}

module.exports = {
  handleCreateNote,
  handleGetAllNotes,
  handleGetNoteById,
  handleUpdateNote,
  handleDeleteNote,
}
