"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import NoteForm from "@/components/NoteForm" // NoteForm component to create/edit notes
import NoteList from "@/components/NoteList" // NoteList component to display notes
import { Note } from "@/types"
import TagFilter from "@/components/TagFilter" //TagFilter component to handle tag filtering
import * as noteApi from "@/services/noteApi" // API service for notes

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [noteToEdit, setNoteToEdit] = useState<Note | null>(null)
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotes = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Fetch all notes and filter client-side for active/archived.
      const allNotes = await noteApi.getNotes()
      setNotes(allNotes)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to fetch notes.")
      } else {
        setError("An unknown error occurred.")
      }
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  // NoteForm handler to create or update notes
  const saveNoteHandler = async (
    noteData: { title: string; content?: string; tags: string[] },
    idToUpdate?: string
  ) => {
    setIsLoading(true)
    setError(null)
    try {
      const payload = {
        // This is the NotePayload for the API
        title: noteData.title,
        content: noteData.content,
        tags: noteData.tags, // Backend expects array of tag names
      }
      if (idToUpdate) {
        await noteApi.updateNote(idToUpdate, payload)
      } else {
        await noteApi.createNote(payload)
      }
      setNoteToEdit(null) // Clear edit form
      fetchNotes() // Re-fetch all notes
    } catch (err) {
      if (err instanceof Error) {
        setError(
          err.message || `Failed to ${idToUpdate ? "update" : "create"} note.`
        )
      } else {
        setError("An unknown error occurred.")
      }

      console.error(err)
      setIsLoading(false) // Stop loading on error
    }
  }

  // NoteList handler for delete
  const deleteNoteHandler = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setIsLoading(true)
      setError(null)
      try {
        await noteApi.deleteNote(id)
        if (noteToEdit?.id === id) setNoteToEdit(null)
        fetchNotes() // Re-fetch
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Failed to delete note.")
        } else {
          setError("An unknown error occurred.")
        }

        console.error(err)
        setIsLoading(false)
      }
    }
  }

  // NoteList handler for toggling archive status
  const toggleArchiveNoteHandler = async (id: string) => {
    const noteToToggle = notes.find((n) => n.id === id)
    if (!noteToToggle) return

    setIsLoading(true)
    setError(null)
    try {
      await noteApi.updateNote(id, { archived: !noteToToggle.archived })
      if (noteToEdit?.id === id) setNoteToEdit(null)
      fetchNotes() // Re-fetch
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to update archive status.")
      } else {
        setError("An unknown error occurred.")
      }

      console.error(err)
      setIsLoading(false)
    }
  }

  // NoteList handler for setting a note to edit
  const handleSetNoteToEdit = (note: Note) => {
    setNoteToEdit(note)
  }

  // NoteForm handler to cancel editing
  const handleCancelEdit = () => {
    setNoteToEdit(null)
  }

  // Tag Filtering Logic
  const uniqueTags = useMemo(() => {
    const allTagObjects = notes.flatMap((note) => note.tags || [])
    const allTagNames = allTagObjects.map((tag) => tag.name)
    return [...new Set(allTagNames)].sort() // Get unique tag names
  }, [notes])

  const handleSelectTag = (tag: string) => {
    setActiveTagFilter(tag)
  }

  const handleClearTagFilter = () => {
    setActiveTagFilter(null)
  }

  // Apply filtering to notes
  const filteredNotes = useMemo(() => {
    if (!activeTagFilter) {
      return notes
    }
    return notes.filter(
      (note) =>
        note.tags && note.tags.some((tag) => tag.name === activeTagFilter)
    )
  }, [notes, activeTagFilter])

  const activeNotes = filteredNotes.filter((note) => !note.archived)
  const archivedNotes = filteredNotes.filter((note) => note.archived)
  // --- End Tag Filtering Logic ---

  if (isLoading && notes.length === 0)
    return <p className="text-center p-10">Loading notes...</p>

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            My Notes
          </h1>
        </header>
        {error && (
          <p className="my-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded text-center">
            {error}
          </p>
        )}

        <NoteForm
          onSaveNote={saveNoteHandler}
          noteToEdit={noteToEdit}
          onCancelEdit={handleCancelEdit}
        />

        {/* Add TagFilter component here */}
        {uniqueTags.length > 0 && (
          <TagFilter
            uniqueTags={uniqueTags}
            activeTag={activeTagFilter}
            onSelectTag={handleSelectTag}
            onClearFilter={handleClearTagFilter}
          />
        )}

        {isLoading && notes.length > 0 && (
          <p className="text-center my-4">Updating notes list...</p>
        )}

        <section className="mt-10">
          <NoteList
            notes={activeNotes}
            title={`Active Notes ${
              activeTagFilter ? `(tagged: ${activeTagFilter})` : ""
            }`}
            onDelete={deleteNoteHandler}
            onToggleArchive={toggleArchiveNoteHandler}
            onSetToEdit={handleSetNoteToEdit}
          />
        </section>

        {/* Display archived notes only if there are any (either filtered or unfiltered) */}
        {(archivedNotes.length > 0 ||
          (activeTagFilter &&
            notes.some(
              (n) =>
                n.archived && n.tags.some((t) => t.name === activeTagFilter)
            ))) && (
          <section className="mt-10 pt-6 border-t border-gray-200">
            <NoteList
              notes={archivedNotes}
              title={`Archived Notes ${
                activeTagFilter ? `(tagged: ${activeTagFilter})` : ""
              }`}
              onDelete={deleteNoteHandler}
              onToggleArchive={toggleArchiveNoteHandler}
              onSetToEdit={handleSetNoteToEdit}
            />
          </section>
        )}
      </div>
    </main>
  )
}
