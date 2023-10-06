import React, { useState } from 'react'
import axios from 'axios'
import { login } from '../GlobalState/authReducer'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Alert from './Alert'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [loginForm, setloginForm] = useState({
    username: '',
    password: '',
  })

  const [alertmsg, setAlertMsg] = useState(null)

  const onInputChange = (e) => {
    setloginForm({ ...loginForm, [e.target.name]: e.target.value })
  }

  const onLogIn = async (e) => {
    e.preventDefault()
    const logInJson = {
      username: loginForm.username,
      password: loginForm.password,
    }
    try {
      const res = await axios.post('/auth/login', logInJson)
      dispatch(login(res.data.data))
      navigate('/')
    } catch (e) {
      setAlertMsg({ message: e.response.data.error, type: 'danger' })
      setTimeout(() => {
        setAlertMsg(null)
      }, 10000)
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
      {alertmsg && <Alert message={alertmsg.message} type={alertmsg.type} />}
    </div>
  )
}

export default Login
