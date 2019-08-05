import { h, app } from 'https://unpkg.com/hyperapp'
import { targetValue } from 'https://unpkg.com/@hyperapp/events'

const SetCelsius = (_, c) => ({ c, f: null })
const SetFarenheit = (_, f) => ({ f, c: null })
const getCelsius = ({ c, f }) => (c !== null ? c : f ? ((f - 32) * 5) / 9 : '')
const getFarenheit = ({ c, f }) => (f !== null ? f : c ? (c * 9) / 5 + 32 : '')

app({
    node: document.getElementById('app-temp'),
    init: { c: null, f: null },
    view: state =>
        h('div', {}, [
            h('input', {
                type: 'text',
                style: { width: '40px' },
                value: getCelsius(state),
                oninput: [SetCelsius, targetValue],
            }),
            '°C = ',
            h('input', {
                type: 'text',
                style: { width: '40px' },
                value: getFarenheit(state),
                oninput: [SetFarenheit, targetValue],
            }),
            '°F',
        ]),
})
