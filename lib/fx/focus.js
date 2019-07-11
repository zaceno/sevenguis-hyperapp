const f = (_, id) =>
    requestAnimationFrame(_ => {
        document.getElementById(id).focus()
    })
export default id => [f, id]
