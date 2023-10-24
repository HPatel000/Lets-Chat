import React from 'react'
import { AddReactionOutlined, DeleteOutlineRounded } from '@mui/icons-material'
import { getTimeFormate } from '../GlobalState/util'

const ChatBubble = ({ msg, onMsgDelete, onMsgReaction, isGroup }) => {
  return (
    <>
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
      <small>{getTimeFormate(msg.updatedAt)}</small>
      <AddReactionOutlined
        className='chat-bubble-actions-reaction'
        onClick={() => onMsgReaction(msg._id)}
      />
    </>
  )
}

export default ChatBubble
