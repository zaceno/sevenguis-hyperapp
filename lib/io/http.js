const _getText = (dispatch, options) => {
	fetch(options.url)
	.then(response => {
		if (response.status !== 200) throw new Error('response status: ' + response.status)
		return response.text()
	})
	.then(text => dispatch(options.action, text))
	.catch(err => options.error && dispatch(options.error, err))
}
export const getText = (url, action, error) => [_getText, {url, action, error}]
