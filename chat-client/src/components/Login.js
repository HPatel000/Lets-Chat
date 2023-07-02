import React, { useState } from 'react'
import axios from 'axios'
import { login } from '../GlobalState/authReducer'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loginForm, setloginForm] = useState({
    username: '',
    password: '',
  })

  const onInputChange = (e) => {
    setloginForm({ ...loginForm, [e.target.name]: e.target.value })
  }

  const onLogIn = async (e) => {
    e.preventDefault()
    const logInJson = {
      username: loginForm.username,
      password: loginForm.password,
    }
    const res = await axios.post('/auth/login', logInJson)
    if (res.status === 200) {
      dispatch(login(res.data.data))
      navigate('/')
    }
  }
  return (
    <div className='authentication'>
      <h1>Log In</h1>
      <form onSubmit={onLogIn}>
        <label>username</label>
        <input
          onChange={onInputChange}
          name='username'
          value={loginForm.username}
          required
        />
        <label>password</label>
        <input
          onChange={onInputChange}
          name='password'
          type='password'
          value={loginForm.password}
          required
        />
        <button type='submit'>Log In</button>
        <Link className='auth-redirectlink' to='/signin'>
          Don't have an account? Sign In
        </Link>
      </form>
    </div>
  )
}

export default Login
