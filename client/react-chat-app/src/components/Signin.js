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
import { useDispatch } from 'react-redux'
import { login } from '../GlobalState/authReducer'
import { useNavigate } from 'react-router-dom'

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
            id='outlined-name-input'
            margin='normal'
            fullWidth
            onChange={onInputChange}
            label='Name'
            name='name'
            required
          />
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
            id='outlined-email-input'
            margin='normal'
            fullWidth
            onChange={onInputChange}
            label='Email'
            type='email'
            name='email'
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
            SignIn
          </Button>
        </Box>

        <Link href='/login' variant='body2'>
          {'Already have an account? Log In'}
        </Link>
      </Box>
    </Container>
  )
}

export default Signin
