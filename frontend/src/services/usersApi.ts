import { User } from '@/types'
import { handleFetchResponse } from '@/utils'

if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error('Environment variable NEXT_PUBLIC_BACKEND_URL is not defined')
}
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

interface UserPayload {
  email: string
  FullName: string
}
export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/api/users`)
  return handleFetchResponse<User[]>(response)
}
export async function getUserById(id: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`)
  return handleFetchResponse<User>(response)
}
export async function createUser(userData: UserPayload): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
  return handleFetchResponse<User>(response)
}
export async function updateUser(
  id: string,
  userData: Partial<UserPayload>
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
  return handleFetchResponse<User>(response)
}
export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`Failed to delete user with id ${id}`)
  }
}
export async function getUserByEmail(email: string): Promise<User | null> {
  const response = await fetch(`${API_BASE_URL}/api/users/email/${email}`)
  if (response.status === 404) {
    return null // User not found
  }
  return handleFetchResponse<User>(response)
}