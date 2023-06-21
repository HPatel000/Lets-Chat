import React from 'react'
import { useSelector } from 'react-redux'

const Home = () => {
  const { loggedUser } = useSelector((state) => state.authReducer)
  return <div>{loggedUser && loggedUser.name}</div>
}

export default Home
