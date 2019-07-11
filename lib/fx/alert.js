const alert = (dispatch, message) => window.alert(message)
export default message => [alert, message]
