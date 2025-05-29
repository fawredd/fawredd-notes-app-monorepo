const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function findOrCreateTags(tagNames) {
  if (!tagNames || tagNames.length === 0) return []
  const operations = tagNames.map((name) =>
    prisma.tag.upsert({
      // upsert = update or insert
      where: { name },
      update: {}, // No fields to update if tag already exists
      create: { name },
    })
  )
  return Promise.all(operations) // Returns an array of Tag objects
}

async function createNote(data, tagNames) {
  const tagsToConnect = await findOrCreateTags(tagNames)
  return prisma.note.create({
    data: {
      ...data,
      tags: {
        connect: tagsToConnect.map((tag) => ({ id: tag.id })),
      },
    },
    include: { tags: true }, // Include tags in the returned note
  })
}

async function getAllNotes({ archived, tagName }) {
  const where = {}
  if (archived !== undefined) {
    where.archived = archived === "true" || archived === true
  }
  if (tagName) {
    // Filter by notes that have at least one tag with the given name
    where.tags = { some: { name: tagName } }
  }
  return prisma.note.findMany({
    where,
    include: { tags: true }, // Always include tags
    orderBy: { createdAt: "desc" },
  })
}

async function getNoteById(id) {
  return prisma.note.findUnique({
    where: { id },
    include: { tags: true }, // Include tags
  })
}

async function updateNote(id, data, tagNames) {
  const updatePayload = { ...data }

  if (tagNames !== undefined) {
    // Check if tagNames array is provided (can be empty to clear tags)
    const tagsToConnect = await findOrCreateTags(tagNames)
    updatePayload.tags = {
      // set: replaces all existing connected tags with the new set
      set: tagsToConnect.map((tag) => ({ id: tag.id })),
    }
  }

  return prisma.note.update({
    where: { id },
    data: updatePayload,
    include: { tags: true },
  })
}

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
