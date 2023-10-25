import React from 'react'
import { AddReactionOutlined, DeleteOutlineRounded } from '@mui/icons-material'
import { getTimeFormate } from '../GlobalState/util'
import { useSelector } from 'react-redux'

const ChatBubble = ({ msg, onMsgDelete, onMsgReaction, isGroup }) => {
  const state = useSelector((state) => state.authReducer)

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
      <div className='chat-bubble-msg'>
        <p>{msg.message}</p>
      </div>
      <small className='chat-bubble-time'>
        {getTimeFormate(msg.updatedAt)}
      </small>
      <AddReactionOutlined
        className='chat-bubble-actions-reaction'
        onClick={() => onMsgReaction(msg._id)}
      />
    </div>
  )
}

export default ChatBubble
