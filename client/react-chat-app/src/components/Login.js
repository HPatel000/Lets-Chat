import {
  Button,
  TextField,
  Box,
  Link,
  Typography,
  Container,
} from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../GlobalState/authReducer'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { loggedUser } = useSelector((state) => state.authReducer)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [loginForm, setloginForm] = useState({
    name: String,
    username: String,
    email: String,
    password: String,
  })

  const onInputChange = (e) => {
    setloginForm({ ...loginForm, [e.target.name]: e.target.value })
  }

  const onSignIn = async (e) => {
    e.preventDefault()
    const logInJson = {
      username: loginForm.username,
      password: loginForm.password,
    }
    const res = await axios.post('/auth/login', logInJson)
    if (res.status == 200) {
      dispatch(login(res.data.data))
      navigate('/')
    }
  }
  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <Box component='form' onSubmit={onSignIn} sx={{ mt: 1 }}>
          <TextField
            id='outlined-username-input'
            margin='normal'
            fullWidth
            onChange={onInputChange}
            label='Username'
            name='username'
            required
          />
          <TextField
            id='outlined-password-input'
            margin='normal'
            fullWidth
            onChange={onInputChange}
            label='Password'
            type='password'
            name='password'
            inputProps={{
              minLength: 5,
            }}
            required
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            LogIn
          </Button>
        </Box>

        <Link href='/signin' variant='body2'>
          {"Don't have an account? Sign In"}
        </Link>
      </Box>
    </Container>
  )
}

export default Login
