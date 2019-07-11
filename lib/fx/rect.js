function getRect(dispatch, { id, action }) {
    dispatch(action, document.getElementById(id).getBoundingClientRect())
}
export default (id, action) => [getRect, { id, action }]
