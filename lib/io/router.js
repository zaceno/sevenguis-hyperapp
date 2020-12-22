function sub(dispatch, options) {
    const handler = () => get(dispatch, options)
    addEventListener('hashchange', handler)
    return () => removeEventListener(handler)
}

function get(dispatch, options) {
    dispatch(options.action, location.hash)
}

export const listen = (action) => [sub, { action }]
export const current = (action) => [get, { action }]
