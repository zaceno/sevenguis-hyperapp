export default (options) => {
    const BASEURL = (
        location.protocol +
        '//' +
        location.host +
        location.pathname
    ).replace(/\/[^\/]*$/, '/')
    let stopper = null
    const fn = (dispatch, url) => {
        console.log()
        if (!url) return stopper && stopper()
        import(BASEURL + url)
            .then((module) => {
                stopper && stopper()
                stopper = null
                options.onWillStart && dispatch(options.onWillStart)
                requestAnimationFrame(() => {
                    let node = document.querySelector(options.selector)
                    stopper = node ? module.default(node) : null
                    options.onStarted && dispatch(options.onStarted)
                })
            })
            .catch((e) => console.error(e))
    }
    return (url) => [fn, url]
}
