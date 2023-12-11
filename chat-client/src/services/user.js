import axios from 'axios'

export const SignIn = (json) => {
  return axios.post('/api/auth/signin', json)
}

export const LogIn = (json) => {
  return axios.post('/api/auth/login', json)
}

export const LogOut = () => {
  return axios.get('/api/auth/logout')
}

export const checkUserAuthentication = () => {
  return axios.get('/api/auth/checkuser')
}

export const searchusers = (searchInput) => {
  return axios.get(`/api/user/${String(searchInput)}`)
}
