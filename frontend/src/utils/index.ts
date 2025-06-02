// funcion de utilidad para manejar respuestas fetch
export async function handleFetchResponse<T>(response: Response): Promise<T> {
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