import React from 'react'
import { DeleteOutlineRounded } from '@mui/icons-material'
import { getTimeFormate } from '../GlobalState/util'
import { useSelector } from 'react-redux'
import EmojiPicker from './EmojiPicker'
import axios from 'axios'
import data from '@emoji-mart/data'
import { init } from 'emoji-mart'

init({ data })

const ChatBubble = ({ msg, onMsgDelete, isGroup }) => {
  const state = useSelector((state) => state.authReducer)

  const onMsgReaction = async (e) => {
    const res = await axios.put(`/msg/${msg._id}`, { reaction: e.id })
  }

  return (
    <div
      key={msg._id}
      className={`chat-bubble ${
        msg.sender._id === state.user._id
          ? 'chat-bubble-right'
          : 'chat-bubble-left'
      }`}
    >
      <div className='chat-bubble-actions'>
        <DeleteOutlineRounded onClick={() => onMsgDelete(msg._id)} />
      </div>
      {isGroup && (
        <div className='chat-bubble-header'>
          <small>{msg.sender.name} </small>
        </div>
      )}
      <div className='chat-bubble-content'>
        {msg.files &&
          msg.files.length > 0 &&
          msg.files.map((file) => (
            <div
              key={file.filename}
              className='chat-bubble-msg chat-bubble-file'
            >
              {file.contentType.includes('image') && (
                <img src={`/file/${file.filename}`} alt='Chat' />
              )}
              {file.contentType.includes('audio') && (
                <audio controls src={`/file/${file.filename}`} />
              )}
              {file.contentType.includes('video') && (
                <video controls src={`/file/${file.filename}`} />
              )}
            </div>
          ))}
        {msg.message && (
          <div className='chat-bubble-msg'>
            <p>{msg.message}</p>
          </div>
        )}
        <small className='chat-bubble-time'>
          {getTimeFormate(msg.updatedAt)}
        </small>
      </div>
      {msg.reactions.map((reaction) => (
        <em-emoji key={reaction._id} id={reaction.react} size='1em' />
      ))}
      <EmojiPicker onEmojiSelect={onMsgReaction} />
    </div>
  )
}

export default ChatBubble
