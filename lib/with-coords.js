export default (action) => (state, event) => {
    let { left, top } = event.currentTarget.getBoundingClientRect()
    return [action, { x: event.clientX - left, y: event.clientY - top }]
}
