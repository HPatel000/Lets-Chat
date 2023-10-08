import axios from 'axios'
import React, { useState } from 'react'
import { ChatRounded, SearchRounded } from '@mui/icons-material'
import { useSelector } from 'react-redux'

const Header = () => {
  // header search
  const state = useSelector((state) => state.authReducer)
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const onSearchChange = async (e) => {
    setSearchText(e.target.value)
    if (e.target.value) {
      const res = await axios.get(`/user/${String(e.target.value)}`)
      setSearchResults(res.data.data)
    } else setSearchResults([])
  }

  const getUserInitails = (inputname) => {
    const name = inputname.split(' ')
    let initails = ''
    if (name[0]) initails += name[0].charAt(0).toUpperCase()
    if (name[1]) initails += name[1].charAt(0).toUpperCase()
    return initails
  }

  const onNavigation = (id) => {}

  return (
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
  )
}

export default Header
