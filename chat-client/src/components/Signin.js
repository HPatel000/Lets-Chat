import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../GlobalState/authReducer'
import { Link, useNavigate } from 'react-router-dom'

const Signin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [signinForm, setSigninForm] = useState({
    name: String,
    username: String,
    email: String,
    password: String,
  })

  const onInputChange = (e) => {
    setSigninForm({ ...signinForm, [e.target.name]: e.target.value })
  }

  const onSignIn = async (e) => {
    e.preventDefault()
    const signinJson = {
      name: signinForm.name,
      username: signinForm.username,
      email: signinForm.email,
      password: signinForm.password,
    }
    const res = await axios.post('/auth/signin', signinJson)
    if (res.status === 200) {
      dispatch(login(res.data.data))
      navigate('/')
    }
  }
  return (
    <div className='authentication'>
      <h1>Sign In</h1>
      <form onSubmit={onSignIn}>
        <label>name</label>
        <input name='name' required />
        <label>username</label>
        <input name='username' required />
        <label>email</label>
        <input name='email' type='email' required />
        <label>password</label>
        <input name='password' type='password' minLength={5} required />
        <button type='submit'>Sign In</button>
        <Link className='auth-redirectlink' to='/login'>
          Already have an account? Log In
        </Link>
      </form>
    </div>
  )
}

export default Signin
