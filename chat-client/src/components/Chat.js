import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import SendIcon from '@mui/icons-material/Send'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import io from 'socket.io-client'
import ChatBubble from './ChatBubble'
import UseScroll from '../hooks/useScroll'

const Chat = () => {
  const state = useSelector((state) => state.authReducer)
  const location = useLocation()
  const [chatId, setChatId] = useState()
  const [chat, setChat] = useState({})
  const [Receiver, setReceiver] = useState('')
  const [msgText, setMsgText] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [api, setApi] = useState(null)
  const messagesEndRef = useRef(null)
  const { data, hasMore, loading, error } = UseScroll(api, pageNumber, 10)
  const observer = useRef()
  const lastChatElementRef = useCallback((node) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      console.log('USESCROLLLLLLL', entries[0])
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber((prevPageNumber) => prevPageNumber + 1)
        console.log('USESCROLLLLLLL')
      }
    })
    if (node) observer.current.observe(node)
  })

  useEffect(() => {
    // getAllMessages()
    getChatID()
  }, [])

  useEffect(() => {
    if (data.chat) {
      console.log(data)
      setChat((prevState) => {
        if (prevState && prevState.messages) {
          prevState.messages = [...data.chat.messages, ...prevState.messages]
        }
        return JSON.parse(JSON.stringify(data.chat))
      })
      if (data.chat.user1._id === state.user._id) {
        setReceiver(data.chat.user2)
      } else {
        setReceiver(data.chat.user1)
      }
    } else {
      setChat({})
    }
  }, [data])

  useEffect(() => {
    const socket = io.connect('http://localhost:5000')
    socket.on(`${chat._id}`, (payload) => {
      if (chat) {
        setChat((prevChat) => {
          return {
            ...prevChat,
            messages: [...prevChat.messages, payload],
          }
        })
      }
    })
    return () => {
      socket.disconnect()
    }
  }, [data])

  useEffect(() => {
    scrollToBottom()
  }, [chat])

  useEffect(() => {
    if (chatId) {
      setApi(`/chat/msg/get/${chatId}`)
    }
  }, [chatId])

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behaviour: 'smooth' })
  }

  const getChatID = async () => {
    try {
      const res = await axios.get(`/chat/${location.state.id}`)
      if (res.data) {
        setChatId(res.data.chat[0]._id)
        return res.data.chat[0]._id
      }
      return null
    } catch (e) {
      console.error(e)
      return null
    }
  }

  const getAllMessages = async () => {
    const chatId = await getChatID()
    if (!chatId) return
    try {
      const res = await axios.get(`/chat/msg/get/${chatId}`)
      if (res.data.chat) {
        setChat(res.data.chat)
        if (res.data.chat.user1._id === state.user._id) {
          setReceiver(res.data.chat.user2)
        } else {
          setReceiver(res.data.chat.user1)
        }
      } else {
        setChat({})
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onMsgChange = (e) => {
    setMsgText(e.target.value)
  }

  const onSendMsg = async (e) => {
    // e.preventDefault()
    const json = {
      id: chat._id,
      message: msgText,
    }
    const res = await axios.post('/chat/msg/save', json)
    if (res.data.success) {
      setMsgText('')
    }
  }

  const onMsgDelete = async (id) => {
    const res = await axios.delete(`/chat/msg/${id}`)
    if (res.status == 204) {
      await getAllMessages()
    }
  }

  const onMsgReaction = async (id) => {}

  const onKeyUpTextArea = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      onSendMsg()
    }
  }
  return (
    <div className='chat'>
      <div className='chat-header'>
        <h2>{Receiver && Receiver.name}</h2>
      </div>
      <div className='chat-section'>
        {chat.messages &&
          chat.messages.map((msg, index) => {
            if (index === 0) {
              return (
                <div key={msg._id} ref={lastChatElementRef}>
                  <ChatBubble
                    currUserId={state.user._id}
                    msg={msg}
                    onMsgDelete={onMsgDelete}
                    onMsgReaction={onMsgReaction}
                  />
                </div>
              )
            } else {
              return (
                <ChatBubble
                  key={msg._id}
                  currUserId={state.user._id}
                  msg={msg}
                  onMsgDelete={onMsgDelete}
                  onMsgReaction={onMsgReaction}
                />
              )
            }
          })}
        <div ref={messagesEndRef}></div>
      </div>
      <div className='msg-send'>
        <textarea
          onChange={onMsgChange}
          placeholder='Type something...'
          name='msgText'
          value={msgText}
          onKeyUp={onKeyUpTextArea}
        ></textarea>
        <button type='submit' className='msg-send-icon' onClick={onSendMsg}>
          <SendIcon />
        </button>
      </div>
    </div>
  )
}

export default Chat
