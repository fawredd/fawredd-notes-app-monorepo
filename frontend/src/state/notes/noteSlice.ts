import type { Note } from '@/types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as noteApi from '@/services/noteApi'

interface NoteState {
  notes: Note[];
  noteToEdit?: Note["id"] | null; // Optional field to hold the note being edited
}
const initialState:NoteState = {
  notes: [],
  noteToEdit: undefined, // Initialize with null or undefined
}

const noteSlice = createSlice({
  name: 'notes',
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        // Optionally handle loading state
        console.log('Fetching notes...')
      })
      .addCase(fetchNotes.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.notes = action.payload; // Update the notes state with fetched notes
        console.log('Notes fetched successfully:', action.payload);
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        // Optionally handle error state
        console.error('Failed to fetch notes:', action.payload);
      })
  }
})

export const { toggleArchiveNote, setNoteToEdit } = noteSlice.actions

export default noteSlice.reducer

export const fetchNotes = createAsyncThunk(
  'notes/fetchNotes',
  async(args, thunkAPI)=>{
    try {
      const notes = await noteApi.getNotes();
      return notes
    } catch (error: any) {
      // You can use thunkAPI.rejectWithValue to pass a custom error payload
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch notes');
    }
  }
)