import { Note, Tag } from "@/types"

interface NoteItemProps {
  note: Note
  onDelete: (id: string) => void
  onToggleArchive: (id: string) => void
  onSetToEdit: (note: Note) => void
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  onDelete,
  onToggleArchive,
  onSetToEdit,
}) => {
  return (
    <div
      className={`p-4 border rounded-lg shadow-sm mb-4 ${
        note.archived ? "bg-gray-100" : "bg-white"
      }`}
    >
      <h3 className="text-lg font-semibold text-gray-800">{note.title}</h3>
      {note.content && (
        <p className="text-gray-600 mt-1 whitespace-pre-wrap">{note.content}</p>
      )}
      {/* Display Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {note.tags.map((tag: Tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-2">
        Created: {new Date(note.createdAt).toLocaleDateString()}
        {note.updatedAt && (
          <span className="ml-2">
            Updated: {new Date(note.updatedAt).toLocaleDateString()}
          </span>
        )}
        {note.archived && (
          <span className="ml-2 font-semibold text-yellow-600">(Archived)</span>
        )}
      </p>
      <div className="mt-3 flex space-x-2">
        <button
          onClick={() => onSetToEdit(note)}
          className={`text-sm text-blue-600 hover:text-blue-800 font-medium py-1 px-2 rounded hover:bg-blue-100 transition-colors`} 
          disabled={note.archived} // Optionally disable edit for archived notes
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="text-sm text-red-600 hover:text-red-800 font-medium py-1 px-2 rounded hover:bg-red-100 transition-colors"
        >
          Delete
        </button>
        <button
          onClick={() => onToggleArchive(note.id)}
          className="text-sm text-green-600 hover:text-green-800 font-medium py-1 px-2 rounded hover:bg-green-100 transition-colors"
        >
          {note.archived ? "Unarchive" : "Archive"}
        </button>
      </div>
    </div>
  )
}

export default NoteItem
