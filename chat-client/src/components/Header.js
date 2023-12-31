import React from 'react'
import { useSelector } from 'react-redux'
import SearchUsers from './SearchUsers'
import { useNavigate } from 'react-router-dom'
import { getChatIdFromUsers } from '../services/chat'
import LogoutIcon from '@mui/icons-material/Logout'
import { LogOut } from '../services/user'

const Header = () => {
  // header search
  const state = useSelector((state) => state.authReducer)

  const getUserInitails = (inputname) => {
    const name = inputname.split(' ')
    let initails = ''
    if (name[0]) initails += name[0].charAt(0).toUpperCase()
    if (name[1]) initails += name[1].charAt(0).toUpperCase()
    return initails
  }

  const navigate = useNavigate()
  const onNavigation = async (user) => {
    try {
      const chat = await getChatIdFromUsers(user._id)
      if (chat.data) {
        navigate('/chat', { state: { chat: chat.data } })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const onLogout = async () => {
    const res = await LogOut()
    if (!res.error) {
      navigate('/login')
    }
  }

  return (
    <header className='header'>
      {/* <div>App Logo</div> */}
      <SearchUsers onUserSelection={onNavigation} />
      <div className='header-userintiails'>
        {getUserInitails(state.user.name)}
      </div>
      <LogoutIcon onClick={onLogout} />
    </header>
  )
}

export default Header
