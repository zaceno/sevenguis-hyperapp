const getRect = (dispatch, { selector, action }) => {
    requestAnimationFrame((_) => {
        let node = document.querySelector(selector)
        if (!node) return
        dispatch(action, node.getBoundingClientRect())
    })
}

export default (selector, action) => [getRect, { selector, action }]
