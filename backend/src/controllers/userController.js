const userServices = require("../services/userService")
const asyncHandler = require("../utils/asyncHandler")

/**
 * @description Create a new user
 * @access public
 * @function POST
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
const handleCreateUser = asyncHandler(async (req, res) => {
  const { email, password, name, role } = req.body
  const user = await userServices.createUser({ email, password, name, role })
  res.status(201).json(user)
})

/**
 * @description Get user by ID
 * @access private
 * @function GET
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
const handleGetUserById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const user = await userServices.getUserById(id)
  res.status(200).json(user)
})

/**
 * @description Update a user
 * @access private
 * @function PUT
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
const handleUpdateUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { email, name, role } = req.body
  const user = await userServices.updateUser(id, { email, name, role })
  res.status(200).json(user)
})

/**
 * @description Delete a user
 * @access private
 * @function DELETE
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
const handleDeleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  await userServices.deleteUser(id)
  res.status(204).json({ message: "User deleted successfully" })
})

/**
 * @description Get all users
 * @access private
 * @function GET
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
const handleGetAllUsers = asyncHandler(async (req, res) => {
  const users = await userServices.getAllUsers()
  res.status(200).json(users)
})

module.exports = {
  handleCreateUser,
  handleGetUserById,
  handleUpdateUser,
  handleDeleteUser,
  handleGetAllUsers,
}
