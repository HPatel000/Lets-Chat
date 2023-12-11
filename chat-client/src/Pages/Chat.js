import React, { useEffect, useState, useRef } from 'react'
import SendIcon from '@mui/icons-material/Send'
import AttachmentIcon from '@mui/icons-material/Attachment'
import CodeIcon from '@mui/icons-material/Code'
import { useLocation } from 'react-router-dom'
import io from 'socket.io-client'
import { getDateFormate } from '../GlobalState/util'
import ChatBubble from '../components/ChatBubble'
import { Button } from '@mui/material'
import { checkChatAtUnmount } from '../services/chat'
import {
  deleteMessage,
  getMessagesWithPagination,
  saveMessage,
  sendAttachment,
} from '../services/message'

const Chat = () => {
  const chat = useLocation().state.chat

  const [messages, setMessages] = useState([])
  const messagesRef = React.createRef()
  messagesRef.current = messages
  const [msgText, setMsgText] = useState('')

  const [pageNumber, setPageNumber] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const [position, setPosition] = useState()

  const chatContainerRef = useRef()

  useEffect(() => {
    chatContainerRef.current.addEventListener('scroll', function () {
      if (chatContainerRef.current.scrollTop === 0) {
        const scrollPosition =
          chatContainerRef.current.scrollHeight -
          chatContainerRef.current.scrollTop
        setPosition(scrollPosition)
        setPageNumber((prev) => prev + 1)
      }
    })

    return async () => {
      if (chat) await checkChatAtUnmount(chat._id)
    }
  }, [chat])

  useEffect(() => {
    const socket = io.connect(process.env.URL)
    socket.on(`${chat._id}`, (payload) => {
      if (chat._id) {
        if (payload.event === 'added') {
          setMessages((prev) => [payload.msg, ...prev])
        } else if (payload.event === 'deleted') {
          setMessages((prev) => prev.filter((msg) => msg._id !== payload.msgId))
        } else if (payload.event === 'reacted') {
          setMessages((prev) => {
            for (let i = 0; i < prev.length; i++) {
              if (prev[i]._id === payload.msg._id) {
                prev[i] = payload.msg
              }
            }
            return [...prev]
          })
        }
      }
    })
    return () => {
      socket.disconnect()
    }
  }, [chat._id])

  useEffect(() => {
    getAllMessages()
  }, [pageNumber])

  useEffect(() => {
    if (pageNumber === 1) {
      scrollToBottom()
    } else {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight - position
    }
    messagesRef.current = messages
  }, [messages, messagesRef, pageNumber, position])

  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
  }

  const getAllMessages = async () => {
    if (!chat._id || !hasMore) return
    try {
      const res = await getMessagesWithPagination(chat._id, pageNumber, 15)
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
      message: msgText.trimEnd(),
    }
    if (chat._id) {
      const res = await saveMessage(chat._id, json)
      if (res.data) {
        setMsgText('')
      }
    }
  }

  const onMsgDelete = async (id) => {
    const res = await deleteMessage(id)
    if (res.status === 204) {
    }
  }

  const onKeyUpTextArea = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      onSendMsg()
    }
  }

  const onAttachment = async (e) => {
    const formData = new FormData()
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append('file', e.target.files[i])
    }
    await sendAttachment(chat._id, formData)
  }
  return (
    <div className='chat'>
      <div className='chat-header'>
        <h2>{chat.isGroup ? chat.name : chat.sender.name}</h2>
      </div>
      <div className='chat-section' ref={chatContainerRef}>
        {messages &&
          messages
            .slice()
            .reverse()
            .map((msg, index) => {
              let isSameDay = false
              if (index > 0) {
                const prevMsg = messages[messages.length - index]
                isSameDay =
                  prevMsg &&
                  new Date(prevMsg.updatedAt).toDateString() ===
                    new Date(msg.updatedAt).toDateString()
              }
              return (
                <React.Fragment key={msg._id}>
                  {!isSameDay && (
                    <>
                      <p className='chat-section-date'>
                        {getDateFormate(msg.updatedAt)}
                      </p>
                    </>
                  )}
                  <ChatBubble
                    msg={msg}
                    onMsgDelete={onMsgDelete}
                    isGroup={chat.isGroup}
                  />
                </React.Fragment>
              )
            })}
      </div>
      <div className='msg-options'>
        <Button
          variant='contained'
          component='label'
          className='msg-options-btn'
        >
          <input
            type='file'
            accept='image/*, audio/*, video/*'
            style={{ display: 'none' }}
            onChange={onAttachment}
          />
          <AttachmentIcon />
        </Button>
        <Button
          variant='contained'
          component='label'
          className='msg-options-btn'
        >
          <CodeIcon />
        </Button>
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
