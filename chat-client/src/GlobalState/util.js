export const getDateTimeFormate = (date) => {
  return `${new Date(date).toLocaleDateString()}${' '}
          ${new Date(date).toLocaleTimeString('en-us', {
            hour: 'numeric',
            minute: 'numeric',
          })}`
}
export const getDateFormate = (date) => {
  return `${new Date(date).toLocaleDateString()}`
}
export const getTimeFormate = (date) => {
  return `${new Date(date).toLocaleTimeString('en-us', {
    hour: 'numeric',
    minute: 'numeric',
  })}`
}
