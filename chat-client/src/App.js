import React from 'react'
import './App.css'
import Login from './components/Login'
import Signin from './components/Signin'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
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
