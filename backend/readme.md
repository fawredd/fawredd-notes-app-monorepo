## Note Controller Documentation

This section provides detailed documentation for each API controller function in `noteController.js`, based on the schema, services, and repository implementations.

#### 1. `getNotes(req, res)`

- **Description**: Fetches all notes from the database, with optional filters for archived status and tags.
- **Method**: `GET`
- **Endpoint**: `/api/notes`
- **Parameters**:
  - Query Parameters:
    ```json
    {
      "archived": "boolean (optional)",
      "tag": "string (optional)"
    }
    ```
- **Response**:
  - **Success**:
    ```json
    [
      {
        "id": "string",
        "title": "string",
        "content": "string or null",
        "createdAt": "Date",
        "updatedAt": "Date",
        "archived": "boolean",
        "tags": [
          {
            "id": "string",
            "name": "string"
          }
        ]
      }
    ]
    ```
  - **Failure**:
    ```json
    {
      "error": "Failed to fetch notes"
    }
    ```

#### 2. `getNoteById(req, res)`

- **Description**: Fetches a single note by its ID.
- **Method**: `GET`
- **Endpoint**: `/api/notes/:id`
- **Parameters**:
  - Path Parameter:
    ```json
    {
      "id": "string"
    }
    ```
- **Response**:
  - **Success**:
    ```json
    {
      "id": "string",
      "title": "string",
      "content": "string or null",
      "createdAt": "Date",
      "updatedAt": "Date",
      "archived": "boolean",
      "tags": [
        {
          "id": "string",
          "name": "string"
        }
      ]
    }
    ```
  - **Failure**:
    ```json
    {
      "error": "Note not found"
    }
    ```

#### 3. `createNote(req, res)`

- **Description**: Creates a new note with optional tags.
- **Method**: `POST`
- **Endpoint**: `/api/notes`
- **Parameters**:
  - Body Parameters:
    ```json
    {
      "title": "string",
      "content": "string",
      "tags": ["string (optional)"]
    }
    ```
- **Response**:
  - **Success**:
    ```json
    {
      "id": "string",
      "title": "string",
      "content": "string or null",
      "createdAt": "Date",
      "updatedAt": "Date",
      "archived": "boolean",
      "tags": [
        {
          "id": "string",
          "name": "string"
        }
      ]
    }
    ```
  - **Failure**:
    ```json
    {
      "error": "Failed to create note"
    }
    ```

#### 4. `updateNote(req, res)`

- **Description**: Updates an existing note by its ID, including its tags.
- **Method**: `PUT`
- **Endpoint**: `/api/notes/:id`
- **Parameters**:
  - Path Parameter:
    ```json
    {
      "id": "string"
    }
    ```
  - Body Parameters:
    ```json
    {
      "title": "string (optional)",
      "content": "string (optional)",
      "archived": "boolean (optional)",
      "tags": ["string (optional)"]
    }
    ```
- **Response**:
  - **Success**:
    ```json
    {
      "id": "string",
      "title": "string",
      "content": "string or null",
      "createdAt": "Date",
      "updatedAt": "Date",
      "archived": "boolean",
      "tags": [
        {
          "id": "string",
          "name": "string"
        }
      ]
    }
    ```
  - **Failure**:
    ```json
    {
      "error": "Failed to update note"
    }
    ```

#### 5. `deleteNote(req, res)`

- **Description**: Deletes a note by its ID.
- **Method**: `DELETE`
- **Endpoint**: `/api/notes/:id`
- **Parameters**:
  - Path Parameter:
    ```json
    {
      "id": "string"
    }
    ```
- **Response**:
  - **Success**:
    ```json
    {
      "message": "Note deleted successfully"
    }
    ```
  - **Failure**:
    ```json
    {
      "error": "Failed to delete note"
    }
    ```

### Notes

- Refer to `noteService.js` and `noteRepository.js` for detailed business logic and database interactions.## Note Controller Documentation
