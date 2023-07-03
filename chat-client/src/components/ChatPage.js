import React, { useEffect, useState } from 'react'
import Header from './Header'
import Chat from './Chat'

const ChatPage = () => {
  return (
    <div className='home'>
      {/* <Header /> */}
      <Chat chatID={'649b255b09a873fe1dcd90dd'} />
    </div>
  )
}

export default ChatPage
