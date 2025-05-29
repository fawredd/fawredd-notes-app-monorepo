interface TagFilterProps {
  uniqueTags: string[]
  activeTag: string | null
  onSelectTag: (tag: string) => void
  onClearFilter: () => void
}

// Maybe i could implement a multi-select filter in the future by an array of tags
const TagFilter: React.FC<TagFilterProps> = ({
  uniqueTags,
  activeTag,
  onSelectTag,
  onClearFilter,
}) => {
  if (uniqueTags.length === 0) {
    return null // Don't render if there are no tags to filter by
  }

  return (
    <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
      <h3 className="text-md font-semibold mb-3 text-gray-700">
        Filter by Tag:
      </h3>
      <div className="flex flex-wrap gap-2 items-center">
        {uniqueTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            className={`px-3 py-1 text-sm rounded-full transition-colors
                        ${
                          activeTag === tag
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                        }`}
          >
            {tag}
          </button>
        ))}
        {activeTag && (
          <button
            onClick={onClearFilter}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-full border border-gray-300"
            title="Clear tag filter"
          >
            &times; Clear Filter
          </button>
        )}
      </div>
    </div>
  )
}

export default TagFilter
