import { h, app } from 'https://unpkg.com/hyperapp@beta'
import {
    onAnimationFrame,
    targetValue,
} from 'https://unpkg.com/@hyperapp/events'
import Timestamp from '../lib/fx/timestamp.js'

const GAUGE_WIDTH = 300
const DEFAULT_DURATION = 5
const MAX_DURATION = 10
const MIN_DURATION = 1

const getFractionElapsed = state =>
    Math.min(1, (state.now - state.started) / state.duration / 1000)

const getRemainingMs = state =>
    1000 * state.duration + state.started - state.now

const getRemainingSeconds = state =>
    Math.max(Math.round(getRemainingMs(state) / 1000), 0)
const isRunning = state => getRemainingMs(state) > 0
const SetDuration = (state, duration) => ({ ...state, duration })
const ClickReset = state => [state, Timestamp(DoReset)]
const DoReset = (state, now) => ({
    ...state,
    now: now,
    started: now,
})
const SetNow = (state, now) => {
    //    console.log(isRunning(state))
    return { ...state, now }
}

app({
    node: document.getElementById('app-timer'),
    init: [{ duration: DEFAULT_DURATION }, Timestamp(DoReset)],
    subscriptions: state => [isRunning(state) && onAnimationFrame(SetNow)],
    view: state =>
        h('div', { id: 'app-timer' }, [
            h('p', {}, ['Remaining time: ', getRemainingSeconds(state), 's ']),
            h(
                'div',
                {
                    class: 'gauge-container',
                    style: { width: GAUGE_WIDTH + 'px' },
                },
                h('div', {
                    class: 'gauge-bar',
                    style: {
                        width:
                            Math.round(
                                GAUGE_WIDTH * getFractionElapsed(state)
                            ) + 'px',
                    },
                })
            ),
            h('p', {}, [
                'Duration:',
                h('input', {
                    type: 'range',
                    min: MIN_DURATION,
                    max: MAX_DURATION,
                    value: state.duration,
                    oninput: [SetDuration, targetValue],
                }),
                ' ',
                state.duration,
                's',
            ]),
            h('p', {}, [h('button', { onclick: ClickReset }, 'Reset timer')]),
        ]),
})
