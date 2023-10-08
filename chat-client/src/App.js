import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Chat from './Pages/Chat'
import Login from './Pages/Login'
import Signin from './Pages/Signin'
import Home from './Pages/Home'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
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
