import { h, app } from 'https://unpkg.com/hyperapp'

app({
    node: document.getElementById('app-counter'),
    init: 0,
    view: state =>
        h('div', {}, [
            state,
            h('button', { onclick: state => state + 1 }, 'Count'),
        ]),
})
