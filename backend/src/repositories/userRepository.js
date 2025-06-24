const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const userSchema = require('../middlewares/userDataValidator')

async function findOrCreateUser(data) {

  return prisma.user.upsert({
    where: { email: data.email },
    update: {}, // No fields to update if user already exists
    create: data,
  })
}

async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
  })
}

async function getUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  })
}

async function updateUser(id, data) {
  const result = userSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors.map(e => e.message).join(', '));
  } 
  return prisma.user.update({
    where: { id },
    data,
  })
}

async function deleteUser(id) {
  return prisma.user.delete({
    where: { id },
  })
}

module.exports = {
  findOrCreateUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
}