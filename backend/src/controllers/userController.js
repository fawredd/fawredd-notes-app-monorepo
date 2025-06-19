const userServices = require('../services/userService')
const asyncHandler = require('../utils/asyncHandler')

/**
 * @desc    Create a new user
 * @route   POST /api/users
 * @access  Public
 */
const handleCreateUser = asyncHandler(async (req, res) => {
     // Input validation is assumed to be handled by a middleware before this.
    const { email, password, name, role } = req.body
    // The service should throw an error if the user already exists.
    const user = await userServices.createUser({ email, password, name, role })
    res.status(201).json(user)
})

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
const handleGetUserById = asyncHandler(async (req, res) => {
  const { id } = req.params
  // The service should throw an error if the user is not found.
  const user = await userServices.getUserById(id);
  res.status(200).json(user);
})

/**
 * @desc    Update a user
 * @route   PUT /api/users/:id
 * @access  Private
 */
const handleUpdateUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { email, name, role } = req.body
  // The service should throw a 404 error if the user is not found.
  const user = await userServices.updateUser(id, { email, name, role });
  res.status(200).json(user);
})
  
/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const handleDeleteUser = asyncHandler(async (req, res)=> {
  const { id } = req.params
  // The service should throw a 404 error if the user is not found.
  await userServices.deleteUser(id)
  res.status(204).json({ message: 'User deleted successfully' })
})

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
const handleGetAllUsers = asyncHandler(async (req, res, next) => {
  const users = await userServices.getAllUsers()
  res.status(200).json(users)
})

module.exports = {
  handleCreateUser,
  handleGetUserById,
  handleUpdateUser,
  handleDeleteUser,
  handleGetAllUsers
}