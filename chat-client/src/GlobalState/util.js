export const getDateFormate = (date) => {
  return `${new Date(date).toLocaleDateString()}${' '}
          ${new Date(date).toLocaleTimeString('en-us', {
            hour: 'numeric',
            minute: 'numeric',
          })}`
}
