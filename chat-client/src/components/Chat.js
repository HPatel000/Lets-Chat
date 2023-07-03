import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SendIcon from '@mui/icons-material/Send'
import axios from 'axios'

const Chat = ({ chatID }) => {
  const state = useSelector((state) => state.authReducer)

  const [chat, setChat] = useState({})
  const [user2, setUser2] = useState('')
  const [msgText, setMsgText] = useState('')

  useEffect(() => {
    getAllMessages()
  }, [chatID])

  const getAllMessages = async () => {
    try {
      const res = await axios.get(`/chat/msg/get/${chatID}`)
      if (res.data.chat) {
        setChat(res.data.chat)
        if (res.data.chat.user1._id === state.user._id) {
          setUser2(res.data.chat.user2)
        } else {
          setUser2(res.data.chat.user1)
        }
      } else {
        setChat({})
      }
    } catch (e) {
      setChat({})
    }
  }

  const onMsgChange = (e) => {
    setMsgText(e.target.value)
  }

  const onSendMsg = async (e) => {
    e.preventDefault()
    const json = {
      id: chat._id,
      message: msgText,
    }
    const res = await axios.post('/chat/msg/save', json)
    if (res.data.success) {
      setMsgText('')
    }
    console.log(res)
  }
  return (
    <>
      <div className='chat-header'>
        <h2>{user2 && user2.name}</h2>
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
        ></textarea>
        <div className='msg-send-icon' onClick={onSendMsg}>
          <SendIcon />
        </div>
      </div>
    </>
  )
}

export default Chat
