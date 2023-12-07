import React, { useState } from 'react'
import { searchusers } from '../services/user'
import { ChatRounded, SearchRounded } from '@mui/icons-material'

const SearchUsers = ({ onUserSelection }) => {
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const onSearchChange = async (e) => {
    setSearchText(e.target.value)
    if (e.target.value) {
      const res = await searchusers(e.target.value)
      setSearchResults(res.data.data)
    } else setSearchResults([])
  }

  return (
    <div className='header-search'>
      <input
        onChange={onSearchChange}
        placeholder='search users'
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
              <p onClick={() => onUserSelection(res)}>{res.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchUsers
