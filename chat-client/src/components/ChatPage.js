import React, { useEffect, useState } from 'react'
import Header from './Header'
import Chat from './Chat'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const ChatPage = () => {
  const state = useSelector((state) => state.authReducer)
  const navigate = useNavigate()

  const [allchat, setAllchat] = useState([])
  useEffect(() => {
    getAllChat().then((res) => {
      // socketMsgs()
    })
  }, [])

  const getAllChat = async () => {
    try {
      const res = await axios.get('/chat')
      if (res.data) {
        setAllchat(res.data)
      } else {
        setAllchat([])
      }
    } catch (e) {
      setAllchat([])
    }
  }

  const getReceiver = (chat) => {
    if (chat.user1._id === state.user._id) {
      return chat.user2.name
    } else {
      return chat.user1.name
    }
  }

  const getLastMessageSenderName = (msg) => {
    if (msg.sender._id === state.user._id) {
      return 'You'
    } else {
      return msg.sender.name
    }
  }

  const onNavigation = (id) => {
    navigate('/chat', { state: { id: id } })
  }
  return (
    <div className='allchat'>
      <h1>Chat</h1>
      {allchat.map((chat) => (
        <div className='single-chat' onClick={() => onNavigation(chat._id)}>
          <h3>{getReceiver(chat)}</h3>
          <span>{getLastMessageSenderName(chat.messages[0])}</span> :
          <span>{chat.messages[0].message}</span>
        </div>
      ))}
    </div>
  )
}

export default ChatPage
