const noteRepository = require('../repositories/noteRepository')

/**
 * Create a note.
 * @param {object} noteData - Note data
 * @returns {Promise<object>} Created note
 */
async function createNote(noteData) {
  const { tags, ...restOfNoteData } = noteData
  return noteRepository.createNote(restOfNoteData, tags || [])
}

/**
 * Get all notes.
 * @param {object} root0 - Filter object
 * @param {boolean|string} [root0.archived] - Archived filter
 * @param {string} [root0.tag] - Tag filter
 * @returns {Promise<Array>} Array of notes
 */
async function getAllNotes({ archived, tag }) {
  return noteRepository.getAllNotes({ archived, tagName: tag })
}

/**
 * Get a note by ID.
 * @param {string} id - Note ID
 * @returns {Promise<object>} Note object
 */
async function getNoteById(id) {
  const note = await noteRepository.getNoteById(id)
  if (!note) {
    throw new Error('Note not found')
  }
  return note
}

/**
 * Update a note by ID.
 * @param {string} id - Note ID
 * @param {object} noteData - Note data to update
 * @returns {Promise<object>} Updated note
 */
async function updateNote(id, noteData) {
  const existingNote = await noteRepository.getNoteById(id)
  if (!existingNote) {
    throw new Error('Note not found for update')
  }
  const { tags, ...restOfNoteData } = noteData
  return noteRepository.updateNote(id, restOfNoteData, tags)
}

/**
 * Delete a note by ID.
 * @param {string} id - Note ID
 * @returns {Promise<object>} Deleted note
 */
async function deleteNote(id) {
  const existingNote = await noteRepository.getNoteById(id)
  if (!existingNote) {
    throw new Error('Note not found for deletion')
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
