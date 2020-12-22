const alert = (_, message) => window.alert(message)
export default (message) => [alert, message]
