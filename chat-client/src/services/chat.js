import axios from 'axios'

export const checkChatAtUnmount = (chatId) => {
  return axios.get(`/api/chat/checkChat/${chatId}`)
}

export const getCurrUserChats = () => {
  return axios.get('/api/chat')
}

export const getChatIdFromUsers = (user) => {
  return axios.get(`/api/chat/user/${user}`)
}

export const createGroup = (json) => {
  return axios.post(`/api/group`, json)
}
