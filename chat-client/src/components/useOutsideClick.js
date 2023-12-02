import React, { useEffect } from 'react'

function useOutsideClick(domNode, handler) {
  useEffect(() => {
    function listener(event) {
      if (domNode.current && !domNode.current.contains(event.target)) {
        handler()
      }
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [handler, domNode])

  return domNode
}

export default useOutsideClick
