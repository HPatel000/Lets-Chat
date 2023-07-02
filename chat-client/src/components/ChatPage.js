import React from 'react'
import Header from './Header'
import Chat from './Chat'
import MsgSend from './MsgSend'

const ChatPage = () => {
  const res = {
    chat: [
      {
        _id: '648c89f1211da7813b53240c',
        user1: {
          _id: '648b50774728545addac7736',
          name: 'Jack Smith',
        },
        user2: {
          _id: '648b434f1d6446dbb32a887c',
          name: 'John Doe',
        },
        messages: [
          {
            _id: '648c89f1211da7813b532409',
            message: 'Heyyaa!!🎉',
            sender: {
              _id: '648b50774728545addac7736',
              name: 'Jack Smith',
            },
            date: '2023-06-16T16:12:33.525Z',
            __v: 1,
            reactions: [
              {
                react: '😎',
                user: {
                  _id: '648b50774728545addac7736',
                  name: 'Jack Smith',
                },
                _id: '648c962224cc6126b05271ae',
              },
            ],
          },
          {
            _id: '648c8e6af67116ed284264da',
            message: 'YOOO🎉',
            sender: {
              _id: '6491f38c759ea855aef2d141',
              name: 'Mark Rober',
            },
            replyOf: {
              _id: '648c89f1211da7813b532409',
              message: 'Heyyaa!!🎉',
              sender: {
                _id: '648b50774728545addac7736',
                name: 'Jack Smith',
              },
              date: '2023-06-16T16:12:33.525Z',
              __v: 1,
            },
            date: '2023-06-16T16:31:38.051Z',
            __v: 0,
            reactions: [],
          },
        ],
        __v: 1,
      },
    ],
  }
  return (
    <div className='home'>
      <Header />
      <Chat chat={res.chat} />
    </div>
  )
}

export default ChatPage
