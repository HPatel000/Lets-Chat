import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useSelector } from 'react-redux'
import SendIcon from '@mui/icons-material/Send'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import io from 'socket.io-client'
import ChatBubble from '../components/ChatBubble'
import UseScroll from '../hooks/useScroll'

const Chat = () => {
  const state = useSelector((state) => state.authReducer)
  const chat = useLocation().state.chat
  const Receiver = chat.user1._id === state.user._id ? chat.user2 : chat.user1
  const messagesEndRef = useRef(null)
  const observer = useRef()

  const [messages, setMessages] = useState([])
  const [msgText, setMsgText] = useState('')

  const [pageNumber, setPageNumber] = useState(1)
  const [api, setApi] = useState(null)

  const lastChatElementRef = useCallback((node) => {
    // if (loading) return
    // if (observer.current) observer.current.disconnect()
    // observer.current = new IntersectionObserver((entries) => {
    //   console.log('USESCROLLLLLLL', entries[0])
    //   if (entries[0].isIntersecting && hasMore) {
    //     setPageNumber((prevPageNumber) => prevPageNumber + 1)
    //     console.log('USESCROLLLLLLL')
    //   }
    // })
    // if (node) observer.current.observe(node)
  })

  useEffect(() => {
    const socket = io.connect('http://localhost:5000')
    socket.on(`${chat._id}`, (payload) => {
      if (chat) {
        if (payload.event === 'added') {
          setMessages((prev) => [...prev, payload.msg])
        } else if (payload.event === 'deleted') {
          setMessages((prev) => prev.filter((msg) => msg._id != payload.msgId))
        } else if (payload.event === 'reacted') {
          // TODO
        }
      }
    })
    return () => {
      socket.disconnect()
    }
  }, [chat])

  useEffect(() => {
    if (chat) {
      setApi(`/msg/${chat._id}`)
    }
  }, [chat])

  useEffect(() => {
    if (api) {
      getAllMessages()
    }
  }, [api])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    console.log(messagesEndRef)
    messagesEndRef.current.scrollIntoView({ behaviour: 'smooth' })
  }

  const getAllMessages = async () => {
    if (!chat) return
    try {
      const res = await axios.get(`${api}`)
      if (res.data) {
        setMessages(res.data)
      } else {
        setMessages([])
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
    const res = await axios.post(`${api}`, json)
    if (res.data) {
      setMsgText('')
    }
  }

  const onMsgDelete = async (id) => {
    const res = await axios.delete(`/msg/${id}`)
    if (res.status == 204) {
      // await getAllMessages()
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
        {messages &&
          messages.map((msg, index) => {
            if (index === 0) {
              return (
                <div
                  key={msg._id}
                  ref={lastChatElementRef}
                  className={`chat-bubble ${
                    msg.sender._id === state.user._id
                      ? 'chat-bubble-right'
                      : 'chat-bubble-left'
                  }`}
                >
                  <ChatBubble
                    msg={msg}
                    onMsgDelete={onMsgDelete}
                    onMsgReaction={onMsgReaction}
                  />
                </div>
              )
            } else {
              return (
                <div
                  key={msg._id}
                  className={`chat-bubble ${
                    msg.sender._id === state.user._id
                      ? 'chat-bubble-right'
                      : 'chat-bubble-left'
                  }`}
                >
                  <ChatBubble
                    msg={msg}
                    onMsgDelete={onMsgDelete}
                    onMsgReaction={onMsgReaction}
                  />
                </div>
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
          onKeyDown={onKeyUpTextArea}
        ></textarea>
        <button type='submit' className='msg-send-icon' onClick={onSendMsg}>
          <SendIcon />
        </button>
      </div>
    </div>
  )
}

export default Chat
