import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from '../HttpInterceptor'
import { useNavigate } from 'react-router-dom'
import { ChatRounded, SearchRounded } from '@mui/icons-material'

const ChatPage = () => {
  // header search
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const onSearchChange = async (e) => {
    setSearchText(e.target.value)
    if (e.target.value) {
      const res = await axios.get(`/user/${e.target.value}`)
      setSearchResults(res.data.data)
    } else setSearchResults([])
  }

  // allchat
  const state = useSelector((state) => state.authReducer)
  const navigate = useNavigate()

  const [allchat, setAllchat] = useState([])
  useEffect(() => {
    getAllChat()
  }, [])

  const getAllChat = async () => {
    try {
      const res = await axios.get('/chat')
      if (res.data) {
        setAllchat(res.data)
      } else {
        setAllchat([])
      }
    } catch (e) {
      setAllchat([])
    }
  }

  const getReceiver = (chat) => {
    if (chat.user1._id === state.user._id) {
      return chat.user2
    } else {
      return chat.user1
    }
  }

  const getLastMessageSenderName = (msg) => {
    if (msg.length == 0) return ''
    if (msg[0].sender._id === state.user._id) {
      return 'You'
    }
    return msg[0].sender.name
  }

  const onNavigation = (id) => {
    navigate('/chat', { state: { id: id } })
  }

  const getUserInitails = (inputname) => {
    const name = inputname.split(' ')
    let initails = ''
    if (name[0]) initails += name[0].charAt(0).toUpperCase()
    if (name[1]) initails += name[1].charAt(0).toUpperCase()
    return initails
  }
  return (
    <>
      <header className='header'>
        {/* <div>App Logo</div> */}
        <div className='header-search'>
          <input
            onChange={onSearchChange}
            placeholder='search'
            name='searchText'
            value={searchText}
            type='search'
          />

          <SearchRounded className='header-search-icon' />
          {searchResults.length > 0 && (
            <div className='header-search-results'>
              {searchResults.map((res) => (
                <div key={res._id}>
                  <ChatRounded />
                  <p onClick={() => onNavigation(res._id)}>{res.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='header-userintiails'>
          {getUserInitails(state.user.name)}
        </div>
      </header>
      <div className='allchat'>
        {/* <h1>Chat</h1> */}
        {allchat.map((chat) => (
          <div
            key={chat._id}
            className='single-chat'
            onClick={() => onNavigation(getReceiver(chat)._id)}
          >
            <p className='allchat-username'>{getReceiver(chat).name}</p>
            {chat.messages.length > 0 && (
              <>
                <span>{getLastMessageSenderName(chat.messages)}</span>
                <span>{`: `}</span>
                <span>{chat.messages[0].message}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default ChatPage
