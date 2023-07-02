import React, { useState } from 'react'

const Header = () => {
  const [searchText, setSearchText] = useState('')

  const onSearchChange = (e) => {
    setSearchText(e.target.value)
  }
  return (
    <header className='header'>
      <div>App Logo</div>
      <div className='header-search'>
        <input
          onChange={onSearchChange}
          placeholder='search'
          name='searchText'
          value={searchText}
          type='search'
        />
      </div>
      <div>P</div>
    </header>
  )
}

export default Header
