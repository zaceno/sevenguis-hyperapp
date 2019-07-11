const noop = () => {}
const subscribe = (dispatch, action) => {
    let nextFrame = () =>
        requestAnimationFrame(time => {
            dispatch(action, time)
            nextFrame()
        })
    nextFrame()
    return () => {
        nextFrame = noop
    }
}
export default action => [subscribe, action]
