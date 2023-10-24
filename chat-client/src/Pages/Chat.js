import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'
import SendIcon from '@mui/icons-material/Send'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import io from 'socket.io-client'
import ChatBubble from '../components/ChatBubble'

const Chat = () => {
  const state = useSelector((state) => state.authReducer)
  const chat = useLocation().state.chat

  const [messages, setMessages] = useState([])
  const [msgText, setMsgText] = useState('')

  const [pageNumber, setPageNumber] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [api, setApi] = useState(null)

  const [position, setPosition] = useState()

  const chatContainerRef = useRef()

  useEffect(() => {
    chatContainerRef.current.addEventListener('scroll', function() {
      if (chatContainerRef.current.scrollTop === 0) {
        const scrollPosition =
          chatContainerRef.current.scrollHeight -
          chatContainerRef.current.scrollTop
        setPosition(scrollPosition)
        setPageNumber((prev) => prev + 1)
      }
    })
  }, [])

  useEffect(() => {
    const socket = io.connect('http://localhost:5000')
    socket.on(`${chat._id}`, (payload) => {
      if (chat) {
        if (payload.event === 'added') {
          setMessages((prev) => [payload.msg, ...prev])
        } else if (payload.event === 'deleted') {
          setMessages((prev) => prev.filter((msg) => msg._id !== payload.msgId))
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
  }, [api, pageNumber])

  useEffect(() => {
    if (pageNumber == 1) {
      scrollToBottom()
    } else {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight - position
    }
  }, [messages])

  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
  }

  const getAllMessages = async () => {
    if (!chat || !hasMore) return
    try {
      const res = await axios.get(`${api}/${pageNumber}/13`)
      if (res.data.length === 0) {
        setHasMore(false)
        return
      }
      if (res.data) {
        setMessages((prev) => [...prev, ...res.data])
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
    scrollToBottom()
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
    if (res.status === 204) {
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
        <h2>{chat.isGroup ? chat.name : chat.sender.name}</h2>
      </div>
      <div
        className='chat-section'
        // onScroll={handleScroll}
        ref={chatContainerRef}
      >
        {messages &&
          messages
            .slice()
            .reverse()
            .map((msg, index) => {
              const previousMessage = messages[index - 1]
              const isSameDay =
                previousMessage &&
                new Date(previousMessage.updatedAt).toDateString() ===
                  new Date(msg.updatedAt).toDateString()
              return (
                <>
                  {/* {!isSameDay && <span>{getDateFormate(msg.updatedAt)}</span>} */}
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
                      isGroup={chat.isGroup}
                    />
                  </div>
                </>
              )
            })}
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
