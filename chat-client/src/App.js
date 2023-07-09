import React from 'react'
import './App.css'
import Login from './components/Login'
import Signin from './components/Signin'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import ChatPage from './components/ChatPage'
import Chat from './components/Chat'
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/chat',
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signin',
    element: <Signin />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
