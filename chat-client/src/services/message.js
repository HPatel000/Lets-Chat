import axios from 'axios'

export const getMessagesWithPagination = (chatId, pageNo, limit) => {
  return axios.get(`/api/msg/${chatId}/${pageNo}/${limit}`)
}

export const saveMessage = (chatId, json) => {
  return axios.post(`/api/msg/${chatId}`, json)
}

export const deleteMessage = (id) => {
  return axios.delete(`/api/msg/${id}`)
}

export const reactMessage = (msgId, reaction) => {
  return axios.put(`/api/msg/${msgId}`, { reaction: reaction })
}

export const sendAttachment = (chatId, formData) => {
  let headers = {
    'Content-Type': 'multipart/form-data',
  }
  return axios.post(`/api/msg/uploadFile/${chatId}`, formData, {
    headers: headers,
  })
}
