import React, { useEffect, useState } from 'react'
import axios from '../HttpInterceptor'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

const Home = () => {
  // allchat
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
            <p className='allchat-username'>
              {chat.isGroup ? chat.name : chat.sender.name}
            </p>
            {chat.lastMessage && (
              <>
                <span>{chat.lastMessage.sender.name || 'UU'}</span>
                <span>{`: `}</span>
                <span>{chat.lastMessage.message}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default Home
