import axios from 'axios'

export const checkChatAtUnmount = (chatId) => {
  return axios.get(`/chat/checkChat/${chatId}`)
}

export const getCurrUserChats = () => {
  return axios.get('/chat')
}

export const getChatIdFromUsers = (user) => {
  return axios.get(`/chat/user/${user}`)
}
