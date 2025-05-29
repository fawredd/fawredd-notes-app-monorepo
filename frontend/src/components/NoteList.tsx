import { Note } from "@/types"
import NoteItem from "./NoteItem"

interface NoteListProps {
  notes: Note[]
  title: string
  onDelete: (id: string) => void
  onToggleArchive: (id: string) => void
  onSetToEdit: (note: Note) => void
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  title,
  onDelete,
  onToggleArchive,
  onSetToEdit,
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
            onDelete={onDelete}
            onToggleArchive={onToggleArchive}
            onSetToEdit={onSetToEdit}
          />
        ))}
      </div>
    </div>
  )
}

export default NoteList
