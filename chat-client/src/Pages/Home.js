import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { getCurrUserChats } from '../services/chat'
import AddIcon from '@mui/icons-material/Add'
import { Fab, SwipeableDrawer } from '@mui/material'
import CreateGroup from '../components/CreateGroup'

const Home = () => {
  // allchat
  const navigate = useNavigate()

  const [allchat, setAllchat] = useState([])
  useEffect(() => {
    getAllChat()
  }, [])

  const [showCreateGroup, setShowCreateGroup] = useState(false)

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setShowCreateGroup(open)
  }

  const groupCreated = () => {
    getAllChat()
    setShowCreateGroup(false)
  }

  const getAllChat = async () => {
    try {
      const res = await getCurrUserChats()
      if (res.data) {
        setAllchat(res.data)
      } else {
        setAllchat([])
      }
    } catch (e) {
      setAllchat([])
    }
  }

  const onNavigation = (chat) => {
    navigate('/chat', { state: { chat: chat } })
  }

  return (
    <div className='home'>
      <Header />
      <div className='allchat'>
        {/* <h1>Chat</h1> */}
        {allchat.map((chat) => (
          <div
            key={chat._id}
            className='single-chat'
            onClick={() => onNavigation(chat)}
          >
            <p className='allchat-username'>
              {chat.isGroup ? chat.name : chat.sender.name}
            </p>
            {chat.lastMessage && chat.lastMessage.message ? (
              <>
                <span>{chat.lastMessage.sender.name || 'UU'}</span>
                <span>{`: `}</span>
                <span>{chat.lastMessage.message}</span>
              </>
            ) : (
              <>
                {chat.lastMessage &&
                chat.lastMessage.files &&
                chat.lastMessage.files.length > 0 ? (
                  <>
                    <span>{chat.lastMessage.sender.name || 'UU'}</span>
                    <span>{`: `}</span>
                    <span>{chat.lastMessage.files[0].originalname}</span>
                  </>
                ) : (
                  <span>Start a Conversation</span>
                )}
              </>
            )}
          </div>
        ))}
        <div className='floatingBtn'>
          <Fab
            sx={{ backgroundColor: '#19a7ce' }}
            aria-label='create group'
            size='medium'
            onClick={() => setShowCreateGroup(true)}
          >
            <AddIcon />
          </Fab>
        </div>
        <SwipeableDrawer
          PaperProps={{
            sx: {
              backgroundColor: '#171717',
              color: '#ededed',
            },
          }}
          anchor={'right'}
          open={showCreateGroup}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          <CreateGroup key={showCreateGroup} groupCreated={groupCreated} />
        </SwipeableDrawer>
      </div>
    </div>
  )
}

export default Home
