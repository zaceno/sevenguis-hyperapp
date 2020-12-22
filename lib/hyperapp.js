import { h, text, app as _app } from './_hyperapp.js'

export const app = (options) => {
    let stopped = false
    let dispatch = null
    _app({
        ...options,
        subscriptions: (state) =>
            stopped || !options.subscriptions
                ? []
                : options.subscriptions(state),
        middleware: (d) => {
            dispatch = (...args) => {
                if (stopped) return d()
                return d(...args)
            }
            return dispatch
        },
    })
    return () => {
        stopped = true
        dispatch()
    }
}
export { h, text }
