import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from '../HttpInterceptor'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

const Home = () => {
  // allchat
  const state = useSelector((state) => state.authReducer)
  const navigate = useNavigate()

  const [allchat, setAllchat] = useState([])
  useEffect(() => {
    getAllChat()
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
      return chat.user2
    } else {
      return chat.user1
    }
  }

  const getLastMessageSenderName = (msg) => {
    if (!msg) return ''
    if (msg.sender._id === state.user._id) {
      return 'You'
    }
    return msg.sender.name.split(' ')[0] || 'UU'
  }

  const onNavigation = (chat) => {
    navigate('/chat', { state: { chat: chat } })
  }

  return (
    <>
      <Header />
      <div className='allchat'>
        {/* <h1>Chat</h1> */}
        {allchat.map((chat) => (
          <div
            key={chat._id}
            className='single-chat'
            onClick={() => onNavigation(chat)}
          >
            <p className='allchat-username'>{getReceiver(chat).name}</p>
            {chat.messages && (
              <>
                <span>{getLastMessageSenderName(chat.messages)}</span>
                <span>{`: `}</span>
                <span>{chat.messages.message}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default Home
