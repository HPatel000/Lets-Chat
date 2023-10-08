import React, { useEffect } from 'react'

const Alert = ({ message, type }) => {
  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  return (
    <div className={`alertPopup alert${type}`}>
      {message ? message : 'Something went wrong!'}
    </div>
  )
}

export default Alert
