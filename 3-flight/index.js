import { h, app } from 'https://unpkg.com/hyperapp'
import { targetValue } from 'https://unpkg.com/@hyperapp/events'
import Alert from '../lib/fx/alert.js'
import Now from '../lib/fx/now.js'

const ONE_WAY = 'one-way'
const TWO_WAY = 'two-way'
const DATE_RX = /^(\d{2})\.(\d{2})\.(\d{4})$/

const parseDate = str => {
    const m = str.match(DATE_RX)
    return m ? Date.parse(`${m[3]}-${m[2]}-${m[1]}`) : m
}

const formatDate = time => {
    const D = new Date(time)
    let d = D.getDate()
    d = (d <= 9 ? '0' : '') + d
    let m = D.getMonth() + 1
    m = (m < 9 ? '0' : '') + m
    return `${d}.${m}.${D.getFullYear()}`
}

const validDate = str => !!parseDate(str)

const backDisabled = state => {
    if (state.ways === ONE_WAY) return true
    if (!validDate(state.leave)) return true
    return false
}

const bookDisabled = state => {
    if (state.ways === ONE_WAY) {
        if (!validDate(state.leave)) return true
        return false
    }
    if (!validDate(state.leave)) return true
    if (!validDate(state.back)) return true
    if (parseDate(state.back) <= parseDate(state.leave)) return true
    return false
}

const Init = (state, today) => ({
    ways: ONE_WAY,
    leave: today,
    back: today,
})

const InpLeave = (state, leave) => ({ ...state, leave })

const InpBack = (state, back) => ({ ...state, back })

const SelectWay = (state, opt) => ({
    ...state,
    ways: opt,
    back: opt === ONE_WAY ? state.leave : state.back,
})

const Book = state => [
    state,
    Alert(
        state.ways === ONE_WAY
            ? `You have booked a one-way flight on ${state.leave}`
            : `You have booked a flight
leaving on ${state.leave},
returning on ${state.back}`
    ),
]

app({
    node: document.getElementById('app-flight'),
    init: [null, Now([Init, formatDate])],
    view: state =>
        h('div', {}, [
            h('p', {}, [
                h('select', { onchange: [SelectWay, targetValue] }, [
                    h(
                        'option',
                        {
                            value: ONE_WAY,
                            selected: state.ways === ONE_WAY,
                        },
                        'one-way flight'
                    ),
                    h(
                        'option',
                        {
                            value: TWO_WAY,
                            selected: state.ways === TWO_WAY,
                        },
                        'return flight'
                    ),
                ]),
            ]),
            h('p', {}, [
                h('input', {
                    type: 'text',
                    class: { invalid: !validDate(state.leave) },
                    value: state.leave,
                    oninput: [InpLeave, targetValue],
                }),
            ]),
            h('p', {}, [
                h('input', {
                    type: 'text',
                    disabled: backDisabled(state),
                    class: {
                        invalid: !validDate(state.back) && !backDisabled(state),
                    },
                    value: state.back,
                    oninput: [InpBack, targetValue],
                }),
            ]),
            h('p', {}, [
                h(
                    'button',
                    { onclick: Book, disabled: bookDisabled(state) },
                    'Book'
                ),
            ]),
        ]),
})
