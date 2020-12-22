import { app } from '../../lib/hyperapp.js'
import html from 'https://unpkg.com/hyperlit'
import alerter from '../../lib/io/alert.js'

const ONE_WAY = 'one-way flight'
const TWO_WAY = 'return flight'

const parseDate = (str) => {
    const m = str && str.match(/^(\d{2}).(\d{2}).(\d{4})$/)
    return m ? Date.parse(`${m[3]}-${m[2]}-${m[1]}`) : m
}

const formatDate = (time) => {
    const D = new Date(time)
    let d = D.getDate()
    d = (d <= 9 ? '0' : '') + d
    let m = D.getMonth() + 1
    m = (m <= 9 ? '0' : '') + m
    return `${d}.${m}.${D.getFullYear()}`
}

const canBook = (state) => {
    const leave = parseDate(state.leave)
    if (!leave) return false
    if (state.way === ONE_WAY) return true
    const back = parseDate(state.back)
    if (!back) return false
    return back > leave
}

const Book = (state) => [
    state,
    state.way === ONE_WAY
        ? alerter(`
		You have booked a one way flight
		on: ${state.leave}	
	`)
        : alerter(`
		You have booked a two-way flight
		departing: ${state.leave}
		returning: ${state.back}
	`),
]

const SetWay = (state, ev, way = ev.target.value) => ({
    ...state,
    way,
    back: way === TWO_WAY ? state.leave : '',
})

const SetLeave = (state, ev) => ({ ...state, leave: ev.target.value })

const SetBack = (state, ev) => ({ ...state, back: ev.target.value })

export default (node) =>
    app({
        node,
        init: {
            way: ONE_WAY,
            leave: formatDate(Date.now()),
            back: '',
        },
        view: (state) => html`
            <div class="app app-flights">
                <p>
                    <select onchange=${SetWay}>
                        <option selected=${state.way === ONE_WAY}>
                            ${ONE_WAY}
                        </option>
                        <option selected=${state.way === TWO_WAY}>
                            ${TWO_WAY}
                        </option>
                    </select>
                </p>
                <p>
                    <label>
                        <span>Depart:</span>
                        <input
                            type="text"
                            class=${{ error: !parseDate(state.leave) }}
                            value=${state.leave}
                            oninput=${SetLeave}
                        />
                    </label>
                </p>
                <p>
                    <label>
                        <span>Return:</span>
                        <input
                            type="text"
                            disabled=${state.way === ONE_WAY}
                            class=${{ error: !parseDate(state.back) }}
                            value=${state.back}
                            oninput=${SetBack}
                        />
                    </label>
                </p>
                <p>
                    <button onclick=${Book} disabled=${!canBook(state)}>
                        Book
                    </button>
                </p>
            </div>
        `,
    })
