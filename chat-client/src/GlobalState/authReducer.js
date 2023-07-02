import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {
    _id: '6491f38c759ea855aef2d141',
    name: 'Mark Rober',
    email: 'mark@email.com',
    username: 'markR',
  },
}

const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload
    },
    logout: (state, action) => {
      state.user = null
    },
  },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer
