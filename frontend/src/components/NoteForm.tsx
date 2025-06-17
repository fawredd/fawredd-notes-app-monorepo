"use client"

import { useState, useEffect } from "react"
import { Note } from "@/types"

import *  as notesActions from "@/state/notes/noteSlice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/state/store"

interface NoteFormProps {
  /**
    onSaveNote: (
    noteData: { title: string; content?: string; tags: string[] },
    idToUpdate?: string
  ) => void
  noteToEdit: Note | null // Note being edited, or null if creating new
  onCancelEdit: () => void // To clear the edit state
  **/
}

const NoteForm: React.FC<NoteFormProps> = ({
  // onSaveNote,
  // noteToEdit,
  // onCancelEdit,
}) => {
  const dispatch = useDispatch<AppDispatch>() 
  const noteToEditId = useSelector(notesActions.selectNoteToEdit)
  const noteToEdit = useSelector(notesActions.selectNotes).find(
    (note) => note.id === noteToEditId
  )
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tagsInput, setTagsInput] = useState("")

  // Effect to populate form fields when noteToEdit changes
  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title)
      setContent(noteToEdit.content || "")
      setTagsInput(
        noteToEdit.tags ? noteToEdit.tags.map((tag) => tag.name).join(", ") : "" //convert tags to comma-separated string
      )
    } else {
      setTitle("") // Clear form when not editing or when noteToEdit becomes null
      setContent("")
      setTagsInput("")
    }
  }, [noteToEdit])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      alert("Title is required")
      return
    }

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "")
    dispatch(notesActions.saveNote({ noteData: { title, content, tags }, noteId: noteToEdit?.id }))
    //onSaveNote({ title, content, tags }, noteToEdit?.id)

    // Only clear form if creating a new note, or after successful update if user don't want to keep editing
    if (!noteToEdit) {
      setTitle("")
      setContent("")
      setTagsInput("")
    } else {
      dispatch(notesActions.cancelEdit()) // Clear editing mode after update
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 border border-gray-300 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold mb-4">
        {noteToEdit ? "Edit Note" : "Add New Note"}
      </h2>
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      {/* Tags Input */}
      <div className="mb-4">
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., work, personal, urgent"
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {noteToEdit ? "Update Note" : "Add Note"}
        </button>
        {noteToEdit && (
          <button
            type="button"
            onClick={()=> dispatch(notesActions.cancelEdit())} // Clear editing mode
            className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  )
}

export default NoteForm
