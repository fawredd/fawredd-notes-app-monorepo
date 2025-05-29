import { Note } from "@/types"

if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
  throw new Error("Environment variable NEXT_PUBLIC_BACKEND_URL is not defined")
}
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`

interface NotePayload {
  // For create/update operations
  title: string
  content?: string
  tags?: string[] // Backend expects array of tag names
  archived?: boolean
}

// funcion de utilidad para manejar respuestas
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }))
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    )
  }
  if (response.status === 204) {
    // No Content
    return undefined as T
  }
  return response.json() as Promise<T>
}

export async function getNotes(
  archived?: boolean,
  tag?: string
): Promise<Note[]> {
  const queryParams = new URLSearchParams()
  if (archived !== undefined) queryParams.append("archived", String(archived))
  if (tag) queryParams.append("tag", tag)

  const response = await fetch(
    `${API_BASE_URL}/notes?${queryParams.toString()}`
  )
  return handleResponse<Note[]>(response)
}

export async function getNoteById(id: string): Promise<Note> {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`)
  return handleResponse<Note>(response)
}

export async function createNote(noteData: NotePayload): Promise<Note> {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(noteData),
  })
  return handleResponse<Note>(response)
}

export async function updateNote(
  id: string,
  noteData: Partial<NotePayload>
): Promise<Note> {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(noteData),
  })
  return handleResponse<Note>(response)
}

export async function deleteNote(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "DELETE",
  })
  await handleResponse<void>(response) // Expects 204 No Content
}
