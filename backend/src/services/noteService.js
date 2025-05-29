const noteRepository = require("../repositories/noteRepository")

async function createNote(noteData) {
  const { tags, ...restOfNoteData } = noteData // Separate tags from other data
  // tags here should be an array of strings, e.g., ["work", "project"]
  return noteRepository.createNote(restOfNoteData, tags || [])
}

async function getAllNotes({ archived, tag }) {
  // Renamed tagName to tag for consistency with controller query param
  return noteRepository.getAllNotes({ archived, tagName: tag })
}

async function getNoteById(id) {
  const note = await noteRepository.getNoteById(id)
  if (!note) {
    throw new Error("Note not found")
  }
  return note
}

async function updateNote(id, noteData) {
  const existingNote = await noteRepository.getNoteById(id)
  if (!existingNote) {
    throw new Error("Note not found for update")
  }
  const { tags, ...restOfNoteData } = noteData
  return noteRepository.updateNote(id, restOfNoteData, tags) // Pass tags array (can be empty or undefined)
}

async function deleteNote(id) {
  const existingNote = await noteRepository.getNoteById(id)
  if (!existingNote) {
    throw new Error("Note not found for deletion")
  }
  return noteRepository.deleteNote(id)
}

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
}
