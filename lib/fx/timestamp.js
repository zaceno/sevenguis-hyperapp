const timestamp = (dispatch, action) => dispatch(action, performance.now())
export default action => [timestamp, action]
