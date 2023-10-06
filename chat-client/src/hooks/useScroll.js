import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const UseScroll = (api, pageNum, limit) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [data, setData] = useState([])
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    console.log('USESCROLLLLLLL')
    if (!api) return
    setLoading(true)
    setError(false)
    let cancel
    const cancelToken = new axios.CancelToken((c) => (cancel = c))
    axios
      .get(`${api}?limit=${limit}&page=${pageNum}`, { cancelToken })
      //   ({
      //   method: 'GET',
      //   url: api,
      //   params: { page: pageNum, limit: limit },
      //
      // })
      .then((res) => {
        console.log(res)
        setData(res.data)
        setHasMore(res.data.length > 0)
        setLoading(false)
      })
      .catch((e) => {
        if (axios.isCancel(e)) return
        setError(true)
      })

    return cancel()
  }, [api, pageNum])

  return { loading, error, data, hasMore }
}

export default UseScroll
