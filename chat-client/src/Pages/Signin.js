import React from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../GlobalState/authReducer'
import { Link, useNavigate } from 'react-router-dom'
import { SignIn } from '../services/user'

const Signin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSignIn = async (e) => {
    e.preventDefault()
    const json = {
      name: e.target.name.value,
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
    }
    const res = await SignIn(json)
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
