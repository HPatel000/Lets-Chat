import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { login } from '../GlobalState/authReducer'

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch()
  const [user, setUser] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get('/auth/checkuser')
      .then((res) => {
        if (res.data) {
          dispatch(login(res.data))
          setUser(res.data)
          setLoading(false)
        }
      })
      .catch((e) => {
        dispatch(login(null))
        setLoading(false)
      })
  }, [])

  return (
    <>
      {!isLoading && user && children}
      {!isLoading && !user && <Navigate to='/login' replace />}
    </>
  )
}

export default ProtectedRoute
