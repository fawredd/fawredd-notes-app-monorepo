import type { Tag } from '@/types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TagState {
  tags: Tag[];
}
const initialState:TagState = {
  tags: []
}

const tagSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
  }
})

export const {  } = tagSlice.actions

export default tagSlice.reducer
