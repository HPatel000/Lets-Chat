import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Login = () => {
  const { loggedUser } = useSelector((state) => state.authReducer)
  const dispath = useDispatch()
  return <div>Login</div>
}

export default Login
