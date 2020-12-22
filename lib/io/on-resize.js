const onResize = (dispatch, action) => {
    const handler = () => dispatch(action)
    addEventListener('resize', handler)
    return () => removeEventListener('resize', handler)
}
export default (action) => [onResize, action]
