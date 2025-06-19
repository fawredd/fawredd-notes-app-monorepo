require("dotenv").config()
const userRepository = require("../repositories/userRepository")
const  AppError  = require("../utils/appError")
const { scrypt, randomBytes } = require("node:crypto")
const { promisify } = require("node:util")

/**
 * Lógica para crear un nuevo usuario.
 * @param {object} userData - Datos del usuario { email, password, name, role }
 * @returns {Promise<object>} El usuario creado (sin la contraseña).
 */
async function createUser(userData) {
  const { email, password, name, role } = userData
  // La validación de formato (ej: si el email es válido) debería estar en un middleware de validación.
  // Aquí nos centramos en la lógica de negocio.
  if (!email || !password) {
    throw new AppError("Email and password are required", 400) // Usamos AppError con status 400
  }
  // 1. Verificar si el usuario ya existe.
  const existingUser = await userRepository.getUserByEmail(email)
  if (existingUser) {
    throw new AppError("A user with this email already exists", 409) // 409 Conflict es más apropiado
  }
  // 2. Seguridad
  const scryptPromisified = promisify(scrypt)
  const salt = randomBytes(16).toString("hex") // Genera una sal de 16 bytes (32 caracteres hexadecimales)
  const hashedPassword = (await scryptPromisified(password, salt, 64)).toString(
    "hex"
  ) // 64 bytes para la clave derivada

  // 3. Llamar al repositorio con los datos seguros.
  const newUser = await userRepository.createUser({
    email,
    password: hashedPassword, // Guardamos la contraseña hasheada
    salt: salt,
    name,
    role,
  })
  // Es una buena práctica no devolver la contraseña, ni siquiera la hasheada.
  delete newUser.password
  return newUser
}

/**
 * Obtener un usuario por su ID.
 * @param {string} id - El ID del usuario.
 * @returns {Promise<object>} El usuario encontrado.
 */
async function getUserById(id) {
  const user = await userRepository.getUserById(id);
  if (!user) {
    // Usamos AppError para que el errorHandler se encargue del status 404
    throw new AppError('User not found', 404);
  }
  return user;
}

/**
 * Oobtener un usuario por su email.
 * @param {string} email - El email del usuario.
 * @returns {Promise<object>} El usuario encontrado.
 */
async function getUserByEmail(email) {
  const user = await userRepository.getUserByEmail(email);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
}

// Función para ser consistente con el controlador
async function getAllUsers() {
  return userRepository.getAllUsers();
}

/**
 * Para actualizar un usuario.
 * @param {string} id - El ID del usuario a actualizar.
 * @param {object} userData - Los datos a actualizar.
 * @returns {Promise<object>} El usuario actualizado.
 */
async function updateUser(id, userData) {
  // La lógica de verificar si el usuario existe ahora está dentro del repositorio para ser más eficiente.
  // El repositorio debería intentar actualizar y lanzar un error 404 si no encuentra el documento.
  // Esto evita la doble llamada a la base de datos.
  const updatedUser = await userRepository.updateUser(id, userData);

  if (!updatedUser) {
    // Este `if` es un fallback por si el repositorio retorna `null` en lugar de lanzar un error.
    // La mejor práctica es que el propio repositorio lance el error.
    throw new AppError('User not found, update failed', 404);
  }

  return updatedUser;
}

/**
 * Para eliminar un usuario.
 * @param {string} id - El ID del usuario a eliminar.
 * @returns {Promise<void>}
 */
async function deleteUser(id) {
  // Al igual que en update, dejamos que el repositorio maneje la verificación de existencia
  // para hacer una sola llamada a la DB.
  const result = await userRepository.deleteUser(id);

  if (!result) { // Suponiendo que el repo devuelve algo que indique si se borró o no
      throw new AppError('User not found, deletion failed', 404);
  }
}

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
}
