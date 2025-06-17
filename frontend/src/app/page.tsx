"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import NoteForm from "@/components/NoteForm" // NoteForm component to create/edit notes
import NoteList from "@/components/NoteList" // NoteList component to display notes
import TagFilter from "@/components/TagFilter" //TagFilter component to handle tag filtering

import { useDispatch, useSelector } from "react-redux" 
import {
  selectNotes,
  selectNotesStatus,
  selectNotesError,
  fetchNotes
} from "@/state/notes/noteSlice" // Selectors to access notes state
import { AppDispatch } from "@/state/store"

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>() // Get the dispatch function from Redux store
  // Fetch notes when the component mounts
  useEffect(() => {
      dispatch(fetchNotes());
  }, [dispatch]);
  const notes = useSelector(selectNotes)
  const isLoading = useSelector(selectNotesStatus) === "loading"
  const error = useSelector(selectNotesError)

  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null)
  
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

        <NoteForm />

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
            />
          </section>
        )}
      </div>
    </main>
  )
}
