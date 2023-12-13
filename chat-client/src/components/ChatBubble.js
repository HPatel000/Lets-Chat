import React from 'react'
import { DeleteOutlineRounded, Download } from '@mui/icons-material'
import { getTimeFormate } from '../GlobalState/util'
import { useSelector } from 'react-redux'
import EmojiPicker from './EmojiPicker'
import data from '@emoji-mart/data'
import { init } from 'emoji-mart'
import { reactMessage } from '../services/message'
import axios from 'axios'

init({ data })

const ChatBubble = ({ msg, onMsgDelete, isGroup }) => {
  const state = useSelector((state) => state.authReducer)

  const onMsgReaction = async (e) => {
    await reactMessage(msg._id, e.id)
  }

  const downloadFile = async (file) => {
    const res = await axios.get(`/api/file/${file.filename}`)
    console.log(res)
    const url = window.URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', file.originalname)
    document.body.appendChild(link)
    link.click()
    link.remove()
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
      {msg.sender._id === state.user._id && (
        <div className='chat-bubble-actions'>
          <DeleteOutlineRounded onClick={() => onMsgDelete(msg._id)} />
        </div>
      )}
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
              {file.contentType.includes('image') ||
              file.contentType.includes('audio') ||
              file.contentType.includes('video') ? (
                <>
                  {file.contentType.includes('image') && (
                    <>
                      <img src={`/api/file/${file.filename}`} alt='Chat' />
                    </>
                  )}
                  {file.contentType.includes('audio') && (
                    <audio controls src={`/api/file/${file.filename}`} />
                  )}
                  {file.contentType.includes('video') && (
                    <video controls src={`/api/file/${file.filename}`} />
                  )}
                </>
              ) : (
                <p
                  className='chat-bubble-filename'
                  onClick={() => downloadFile(file)}
                >
                  {file.originalname}
                </p>
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
      <div className='chat-bubble-reactions'>
        {msg.reactions.map((reaction) => (
          <em-emoji
            key={reaction._id}
            id={reaction.react}
            size='1em'
            reacted-user={reaction.user.name}
          />
        ))}
      </div>
      <EmojiPicker onEmojiSelect={onMsgReaction} />
    </div>
  )
}

export default ChatBubble
