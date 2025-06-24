const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

/**
 * Find or create tags by name.
 * @param {string[]} tagNames - Array of tag names
 * @returns {Promise<Array>} Array of tag objects
 */
async function findOrCreateTags(tagNames) {
  if (!tagNames || tagNames.length === 0) return []
  const operations = tagNames.map((name) =>
    prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    }),
  )
  return Promise.all(operations)
}

/**
 * Create a note with tags.
 * @param {object} data - Note data
 * @param {string[]} tagNames - Array of tag names
 * @returns {Promise<object>} Created note
 */
async function createNote(data, tagNames) {
  const tagsToConnect = await findOrCreateTags(tagNames)
  return prisma.note.create({
    data: {
      ...data,
      tags: {
        connect: tagsToConnect.map((tag) => ({ id: tag.id })),
      },
    },
    include: { tags: true },
  })
}

/**
 * Get all notes, optionally filtered by archived status or tag name.
 * @param {object} root0 - Filter object
 * @param {boolean|string} [root0.archived] - Archived filter
 * @param {string} [root0.tagName] - Tag name filter
 * @returns {Promise<Array>} Array of notes
 */
async function getAllNotes({ archived, tagName }) {
  const where = {}
  if (archived !== undefined) {
    where.archived = archived === "true" || archived === true
  }
  if (tagName) {
    where.tags = { some: { name: tagName } }
  }
  return prisma.note.findMany({
    where,
    include: { tags: true },
    orderBy: { createdAt: "desc" },
  })
}

/**
 * Get a note by ID.
 * @param {string} id - Note ID
 * @returns {Promise<object|null>} Note object or null
 */
async function getNoteById(id) {
  return prisma.note.findUnique({
    where: { id },
    include: { tags: true },
  })
}

/**
 * Update a note by ID.
 * @param {string} id - Note ID
 * @param {object} data - Note data to update
 * @param {string[]} [tagNames] - Array of tag names
 * @returns {Promise<object>} Updated note
 */
async function updateNote(id, data, tagNames) {
  const updatePayload = { ...data }

  if (tagNames !== undefined) {
    const tagsToConnect = await findOrCreateTags(tagNames)
    updatePayload.tags = {
      set: tagsToConnect.map((tag) => ({ id: tag.id })),
    }
  }

  return prisma.note.update({
    where: { id },
    data: updatePayload,
    include: { tags: true },
  })
}

/**
 * Delete a note by ID.
 * @param {string} id - Note ID
 * @returns {Promise<object>} Deleted note
 */
async function deleteNote(id) {
  return prisma.note.delete({ where: { id } })
}

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
}
