import React from 'react'
import { AddReactionOutlined, DeleteOutlineRounded } from '@mui/icons-material'

const ChatBubble = ({ currUserId, msg, onMsgDelete, onMsgReaction }) => {
  return (
    <div
      key={msg._id}
      className={`chat-bubble ${
        msg.sender._id === currUserId ? 'chat-bubble-right' : 'chat-bubble-left'
      }`}
    >
      <div className='chat-bubble-actions'>
        <DeleteOutlineRounded onClick={() => onMsgDelete(msg._id)} />
      </div>
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
      <AddReactionOutlined
        className='chat-bubble-actions-reaction'
        onClick={() => onMsgReaction(msg._id)}
      />
    </div>
  )
}

export default ChatBubble
