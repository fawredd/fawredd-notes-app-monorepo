const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const userSchema = require('../middlewares/userDataValidator')

/**
 * Find or create a user by email.
 * @param {object} data - User data
 * @returns {Promise<object>} User object
 */
async function findOrCreateUser(data) {
  return prisma.user.upsert({
    where: { email: data.email },
    update: {},
    create: data,
  })
}

/**
 * Get a user by ID.
 * @param {string} id - User ID
 * @returns {Promise<object|null>} User object or null
 */
async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } })
}

/**
 * Get a user by email.
 * @param {string} email - User email
 * @returns {Promise<object|null>} User object or null
 */
async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } })
}

/**
 * Update a user by ID.
 * @param {string} id - User ID
 * @param {object} data - User data to update
 * @returns {Promise<object>} Updated user
 */
async function updateUser(id, data) {
  const result = userSchema.safeParse(data)
  if (!result.success) {
    throw new Error(result.error.errors.map((e) => e.message).join(', '))
  }
  return prisma.user.update({
    where: { id },
    data,
  })
}

/**
 * Delete a user by ID.
 * @param {string} id - User ID
 * @returns {Promise<object>} Deleted user
 */
async function deleteUser(id) {
  return prisma.user.delete({ where: { id } })
}

module.exports = {
  findOrCreateUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
}
