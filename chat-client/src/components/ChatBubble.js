import React from 'react'
import { AddReactionOutlined, DeleteOutlineRounded } from '@mui/icons-material'
import { getDateFormate } from '../GlobalState/util'

const ChatBubble = ({ msg, onMsgDelete, onMsgReaction }) => {
  return (
    <>
      <div className='chat-bubble-actions'>
        <DeleteOutlineRounded onClick={() => onMsgDelete(msg._id)} />
      </div>
      <div className='chat-bubble-header'>
        {/* <small>{msg.sender.name} </small> */}
        <small>{getDateFormate(msg.createdAt)}</small>
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
