import axios from 'axios'

export const SignIn = (json) => {
  return axios.post('/auth/signin', json)
}

export const LogIn = (json) => {
  return axios.post('/auth/login', json)
}

export const LogOut = () => {
  return axios.get('/auth/logout')
}

export const checkUserAuthentication = () => {
  return axios.get('/auth/checkuser')
}

export const searchusers = (searchInput) => {
  return axios.get(`/user/${String(searchInput)}`)
}
