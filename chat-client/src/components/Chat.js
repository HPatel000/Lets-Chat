import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SendIcon from '@mui/icons-material/Send'
import io from 'socket.io-client'
import axios from 'axios'
import { useLocation } from 'react-router-dom'
const socket = io.connect('http://localhost:5000')

const Chat = () => {
  const state = useSelector((state) => state.authReducer)
  const location = useLocation()

  const [chat, setChat] = useState({})
  const [Receiver, setReceiver] = useState('')
  const [msgText, setMsgText] = useState('')

  useEffect(() => {
    getAllMessages().then((res) => {
      socketMsgs()
    })
  }, [])

  const getAllMessages = async () => {
    try {
      const res = await axios.get(`/chat/msg/get/${location.state.id}`)
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
      setChat({})
    }
  }

  const socketMsgs = () => {
    socket.on(`${location.state.id}`, (payload) => {
      if (chat) {
        setChat((prevChat) => {
          return {
            ...prevChat,
            messages: [...prevChat.messages, payload],
          }
        })
      }
    })
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
          chat.messages.map((msg) => (
            <div
              key={msg._id}
              className={`chat-bubble ${
                msg.sender._id === state.user._id
                  ? 'chat-bubble-right'
                  : 'chat-bubble-left'
              }`}
            >
              <div className='chat-bubble-header'>
                {/* <small>{msg.sender.name} </small> */}
                <small>
                  {new Date(msg.date).toLocaleDateString()}{' '}
                  {new Date(msg.date).toLocaleTimeString('en-us', {
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </small>
              </div>
              <div className='chat-bubble-msg'>
                <p>{msg.message}</p>
              </div>
            </div>
          ))}
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
