import { app } from 'https://unpkg.com/hyperapp'
import html from 'https://unpkg.com/hyperlit'
import { every } from '../../lib/io/time.js'
import progressBar from '../../lib/components/progress-bar.js'

const MAX_DURATION = 15000
const MIN_DURATION = 2000
const DEFAULT_DURATION = 7000

const initialTimer = {
    running: false,
    started: 0,
    current: 0,
    duration: DEFAULT_DURATION,
}

const stop = (state) => ({
    ...initialTimer,
    duration: state.duration,
})
const setDuration = (state, duration) => ({ ...state, duration })

const Start = (state) => ({
    ...state,
    running: true,
})

const Update = (state, current) => {
    if (!state.running) return state
    if (!state.started)
        return {
            ...state,
            started: current,
            current,
        }
    if (percentDone(state) > 100) return stop(state)
    return { ...state, current }
}

const Stop = (state) => stop(state)

const SetDuration = (state, event) => setDuration(state, +event.target.value)

const percentDone = (state) =>
    (100 * (state.current - state.started)) / state.duration

const isRunning = (state) => state.running

const secondsRemaining = (state) =>
    Math.ceil((state.duration - state.current + state.started) / 1000)

export default (node) =>
    app({
        node,
        init: initialTimer,
        subscriptions: (state) => [isRunning(state) && every(1, Update)],
        view: (state) => html`
            <div class="app app-timer">
                <p>
                    <label>
                        <span>Duration:</span>
                        <input
                            type="range"
                            min=${MIN_DURATION}
                            max=${MAX_DURATION}
                            oninput=${SetDuration}
                            value=${state.duration}
                        />
                        <span>
                            ${' ' + Math.round(state.duration / 100) / 10 + 's'}
                        </span>
                    </label>
                </p>
                <${progressBar}
                    running=${isRunning(state)}
                    percent=${percentDone(state)}
                    text="${secondsRemaining(state)}s"
                />
                <p>
                    <button disabled=${isRunning(state)} onclick=${Start}>
                        Start
                    </button>
                    <button disabled=${!isRunning(state)} onclick=${Stop}>
                        Stop
                    </button>
                </p>
            </div>
        `,
    })
