import { app } from '../../lib/hyperapp.js'
import html from 'https://unpkg.com/hyperlit'

const SetCelsius = (_, x) => ({ c: x, f: (x * 9) / 5 + 32 })

const SetFarenheit = (_, x) => ({ f: x, c: ((x - 32) * 5) / 9 })

const withValue = (action) => (_, ev) => [action, ev.target.value]

export default (node) =>
    app({
        node,
        init: { c: null, f: null },
        view: (state) => html`
            <div class="app app-temperature">
                <p>
                    <label>
                        <input
                            type="text"
                            style=${{ width: '40px' }}
                            value=${state.c}
                            oninput=${withValue(SetCelsius)}
                        />
                        <span>°C =</span>
                        <input
                            type="text"
                            style=${{ width: '40px' }}
                            value=${state.f}
                            oninput=${withValue(SetFarenheit)}
                        />
                        <span>°F</span>
                    </label>
                </p>
            </div>
        `,
    })
