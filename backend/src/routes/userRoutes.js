const express = require("express")
const userController = require("../controllers/userController")
const {
  validateUserData,
  userSchema,
  userIdSchema,
} = require("../middlewares/userDataValidator")
const router = express.Router()

router.post(
  "/",
  validateUserData(userSchema, "body"),
  userController.handleCreateUser
)
router.get("/", userController.handleGetAllUsers)
router.get(
  "/:id",
  validateUserData(userIdSchema, "params"),
  userController.handleGetUserById
)
router.put(
  "/:id",
  validateUserData(userIdSchema, "params"),
  validateUserData(userSchema, "body"),
  userController.handleUpdateUser
)
router.delete(
  "/:id",
  validateUserData(userIdSchema, "params"),
  userController.handleDeleteUser
)

module.exports = router
