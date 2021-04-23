const _every = (dispatch, options) => {
	let interval = setInterval(() => dispatch(options.action, Date.now(), options.time))
	return () => clearInterval(interval)
}
export const every = (time, action) => [_every, {time, action}]