import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loggedUser: null,
}

const authSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    login: (state, action) => {
      state.loggedUser = action.payload
    },
    logout: (state, action) => {
      state.loggedUser = null
    },
  },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer
