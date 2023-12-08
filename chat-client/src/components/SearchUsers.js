import React, { useState } from 'react'
import { searchusers } from '../services/user'
import { Chip } from '@mui/material'
import { ChatRounded, SearchRounded } from '@mui/icons-material'
import { useEffect } from 'react'
import useOutsideClick from './useOutsideClick'
import { useRef } from 'react'

const SearchUsers = ({ multiple = false, onUserSelection }) => {
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [isSearchResultsVisible, setSearchResultsVisible] = useState(false)
  const searchResultsRef = useRef()
  useOutsideClick(searchResultsRef, () => {
    setSearchResultsVisible(false)
    setSearchText('')
    setSearchResults([])
  })

  const onSearchChange = async (e) => {
    setSearchText(e.target.value)
    if (e.target.value) {
      const res = await searchusers(e.target.value)
      setSearchResults(res.data.data)
      setSearchResultsVisible(true)
    } else setSearchResults([])
  }

  const userSelected = (user) => {
    if (!multiple) {
      onUserSelection(user)
    } else {
      const ifPresent = selectedUsers.filter((u) => u._id === user._id)
      if (ifPresent.length === 0) {
        setSelectedUsers((prev) => [...prev, user])
      }
    }
  }

  const handleUserDelete = (user) => {
    if (multiple) {
      setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id))
    }
  }

  useEffect(() => {
    if (multiple) {
      onUserSelection(selectedUsers)
    }
  }, [multiple, onUserSelection, selectedUsers])

  return (
    <div className='header-search'>
      <input
        className='header-search-input'
        onChange={onSearchChange}
        placeholder='search users'
        name='searchText'
        value={searchText}
        type='search'
      />

      <SearchRounded className='header-search-icon' />
      {selectedUsers.length > 0 && (
        <div className='header-search-selected-users-chips-wrapper'>
          {selectedUsers.map((user) => (
            <Chip
              label={user.username}
              variant='outlined'
              onDelete={() => handleUserDelete(user)}
            />
          ))}
        </div>
      )}
      {isSearchResultsVisible && searchResults.length > 0 && (
        <div className='header-search-results' ref={searchResultsRef}>
          {searchResults.map((user) => (
            <div key={user._id} onClick={() => userSelected(user)}>
              <ChatRounded />
              <p>
                <b>{user.username}</b>
                <br /> <small>{user.name}</small>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchUsers
