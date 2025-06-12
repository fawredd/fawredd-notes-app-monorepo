import {configureStore} from '@reduxjs/toolkit'
import notesReducer  from '@/state/notes/noteSlice'

export const store = configureStore({
  reducer:{
    notesState: notesReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch