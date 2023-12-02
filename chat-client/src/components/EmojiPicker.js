import React, { useRef, useState } from 'react'
import { AddReactionOutlined } from '@mui/icons-material'

import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

import useOutsideClick from './useOutsideClick'

const EmojiPicker = () => {
  const [isPickerVisible, setPickerVisible] = useState(false)
  const pickerRef = useRef()
  useOutsideClick(pickerRef, () => setPickerVisible(false))

  const handleButtonClick = () => {
    setPickerVisible(true)
  }
  return (
    <>
      <AddReactionOutlined
        className='chat-bubble-actions-reaction'
        onClick={() => handleButtonClick()}
      ></AddReactionOutlined>
      {isPickerVisible && (
        <div ref={pickerRef}>
          <Picker data={data} onEmojiSelect={console.log} />
        </div>
      )}
    </>
  )
}

export default EmojiPicker
