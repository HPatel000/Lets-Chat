import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import SendIcon from '@mui/icons-material/Send'
import axios from 'axios'

const Chat = ({ chat }) => {
  const state = useSelector((state) => state.authReducer)

  const [msgText, setMsgText] = useState('')

  const onMsgChange = (e) => {
    setMsgText(e.target.value)
  }

  const onSendMsg = async (e) => {
    e.preventDefault()
    const json = {
      sentTo:
        state.user._id === chat[0].user1._id
          ? chat[0].user2._id
          : chat[0].user1._id,
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
      <div className='chat-section'>
        {chat[0].messages.map((msg) => (
          <div
            key={msg._id}
            className={`chat-bubble ${
              msg.sender._id === state.user._id
                ? 'chat-bubble-right'
                : 'chat-bubble-left'
            }`}
          >
            <div className='chat-bubble-header'>
              <small>{msg.sender.name}</small>
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
