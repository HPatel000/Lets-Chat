import axios from 'axios'

const instance = axios.create({})
console.log('Interceptor', instance.request.toString())

export default instance
