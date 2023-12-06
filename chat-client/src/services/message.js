import axios from 'axios'

export const getMessagesWithPagination = (chatId, pageNo, limit) => {
  return axios.get(`/msg/${chatId}/${pageNo}/${limit}`)
}

export const saveMessage = (chatId, json) => {
  return axios.post(`/msg/${chatId}`, json)
}

export const deleteMessage = (id) => {
  return axios.delete(`/msg/${id}`)
}

export const reactMessage = (msgId, reaction) => {
  return axios.put(`/msg/${msgId}`, { reaction: reaction })
}

export const sendAttachment = (chatId, formData) => {
  let headers = {
    'Content-Type': 'multipart/form-data',
  }
  return axios.post(`/msg/uploadFile/${chatId}`, formData, {
    headers: headers,
  })
}
