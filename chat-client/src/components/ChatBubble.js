import React from 'react'
import { AddReactionOutlined, DeleteOutlineRounded } from '@mui/icons-material'

const ChatBubble = ({ msg, onMsgDelete, onMsgReaction }) => {
  return (
    <>
      <div className='chat-bubble-actions'>
        <DeleteOutlineRounded onClick={() => onMsgDelete(msg._id)} />
      </div>
      <div className='chat-bubble-header'>
        {/* <small>{msg.sender.name} </small> */}
        <small>
          {new Date(msg.createdAt).toLocaleDateString()}{' '}
          {new Date(msg.createdAt).toLocaleTimeString('en-us', {
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
    </>
  )
}

export default ChatBubble
