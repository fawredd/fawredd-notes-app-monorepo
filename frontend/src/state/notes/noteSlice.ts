import type { Note } from '@/types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as noteApi from '@/services/noteApi'
import { RootState } from '../store';

interface NoteState {
  notes: Note[];
  noteToEdit?: Note["id"] | null; // Optional field to hold the note being edited
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Optional status field
  error?: string | null; // Optional field to hold error messages
}
const initialState:NoteState = {
  notes: [],
  noteToEdit: undefined, // Initialize with null or undefined
  status: 'idle', // Initial status
}

const noteSlice = createSlice({
  name: 'notesSlice',
  initialState,
  reducers: {
    toggleArchiveNote: (state, action) => {
      const note = state.notes.find(n => n.id === action.payload)
      if (note) {
        note.archived = !note.archived
      }
    },
    setNoteToEdit: (state, action: PayloadAction<Note["id"]>) => {
      const noteToEdit = state.notes.find(n => n.id === action.payload);
      if (noteToEdit) {
        state.noteToEdit = action.payload // Set the note to edit
        console.log('Note to edit:', noteToEdit)
      } else {
        console.error('Note not found for editing:', action.payload);
      }
    },
    cancelEdit: (State) => {
      // Reset the noteToEdit to null or undefined when editing is cancelled
      State.noteToEdit = null; // or use undefined if preferred
      console.log('Editing cancelled, noteToEdit reset to null');
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle the fetchNotes async thunk
      .addCase(fetchNotes.pending, (state) => {
        // Optionally handle loading state
        console.log('Fetching notes...')
        state.status = 'loading'; // Set status to loading
      })
      .addCase(fetchNotes.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.notes = action.payload; // Update the notes state with fetched notes
        console.log('Notes fetched successfully:', action.payload);
        state.status = 'idle' // Set status to succeeded
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        // Optionally handle error state
        console.error('Failed to fetch notes:', action.payload);
        state.status = 'failed'; // Set status to failed
        state.error = action.payload as string; // Store the error message
      })

      // Handle the deleteNotes async thunk
      .addCase(deleteNote.pending, (state) => {
        // Optionally handle loading state
        console.log('deleting notes...')
        state.status = 'loading'; // Set status to loading
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = action.payload; // Update the notes state with fetched notes
        console.log('Notes fetched successfully:', action.payload);
        state.status = 'idle' // Set status to succeeded
      })
      .addCase(deleteNote.rejected, (state, action) => {
        // Optionally handle error state
        console.error('Failed to fetch notes:', action.payload);
        state.status = 'failed'; // Set status to failed
        state.error = action.payload as string; // Store the error message
      })

            // Handle the saveNotes async thunk
            .addCase(saveNote.pending, (state) => {
              // Optionally handle loading state
              console.log('Saving notes...')
              state.status = 'loading'; // Set status to loading
            })
            .addCase(saveNote.fulfilled, (state, action) => {
              state.notes = action.payload; // Update the notes state with fetched notes
              console.log('Notes fetched successfully:', action.payload);
              state.status = 'idle' // Set status to succeeded
            })
            .addCase(saveNote.rejected, (state, action) => {
              // Optionally handle error state
              console.error('Failed to save/fetch notes:', action.payload);
              state.status = 'failed'; // Set status to failed
              state.error = action.payload as string; // Store the error message
            })
  }
})

export const { toggleArchiveNote, setNoteToEdit, cancelEdit } = noteSlice.actions
export const selectNotes = (state:RootState) => state.notesState.notes
export const selectNoteToEdit = (state:RootState) => state.notesState.noteToEdit
export const selectNotesStatus = (state:RootState) => state.notesState.status
export const selectNotesError = (state:RootState) => state.notesState.error
export default noteSlice.reducer

//Extra reducers for notes API
export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async(_,thunkAPI)=>{
    try {
      const notes = await noteApi.getNotes();
      return notes
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message || 'Failed to fetch notes');
      }
      return thunkAPI.rejectWithValue('An unknown error occurred in fetching notes');
    }
  }
)

export const deleteNote = createAsyncThunk(
  'notes/deleteNote',
  async(noteId: Note["id"],thunkAPI)=>{
    try {
      await noteApi.deleteNote(noteId);
      const notes = await noteApi.getNotes();
      return notes;
    } catch (error) {
      // Ensure error is typed as `unknown` and narrow it down
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message || 'Failed to delete note');
      }
      return thunkAPI.rejectWithValue('An unknown error occurred in deleting note');
    }
  }
)

export const saveNote = createAsyncThunk<
  Note[],
  {noteData: { title: string; content?: string; tags?: string[];}, noteId?: Note["id"] },
  { rejectValue: string }
>(
  'notes/saveNote',
  async({noteData: { title, content, tags} , noteId} , thunkAPI)=>{
    try {
          const apiPayload = {
            // This is the NotePayload for the API
            title: title,
            content: content,
            tags: tags, // Backend expects array of tag names
          }
          if (noteId) {
            await noteApi.updateNote(noteId, apiPayload);
          } else {
            await noteApi.createNote(apiPayload);
          }
          const notes = await noteApi.getNotes(); // Fetch updated notes
          return notes; // Return updated notes
        } catch (err) {
          if (err instanceof Error) {
            return thunkAPI.rejectWithValue(
              err.message || `Failed to ${noteId ? "update" : "create"} note.`
            );
          }
          return thunkAPI.rejectWithValue("An unknown error occurred.");
        }
  }
)