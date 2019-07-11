const getNow = (dispatch, action) => dispatch(action, Date.now())
export default action => [getNow, action]
