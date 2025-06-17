"use client"
import NoteItem from "./NoteItem"
import { useSelector } from 'react-redux'
import { selectNotes } from '@/state/notes/noteSlice'
import { Note } from '@/types'

interface NoteListProps {
  notes:Note[];
  title: string;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  title
}) => {
  
  if (notes.length === 0) {
    return (
      <p className="text-gray-500 italic">
        No {title.toLowerCase()} currently.
      </p>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
      <div className="space-y-4">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
          />
        ))}
      </div>
    </div>
  )
}

export default NoteList
