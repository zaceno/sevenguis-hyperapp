import { h, app } from 'https://unpkg.com/hyperapp'
import { targetValue } from 'https://unpkg.com/@hyperapp/events'
import GetRect from '../lib/fx/rect.js'
import * as Circles from './circles/index.js'

const MAX_DIAMETER = 200
const MIN_DIAMETER = 10

const canUndo = state => Circles.canUndo(state.circles)
const canRedo = state => Circles.canRedo(state.circles)
const mapCircles = (state, f) =>
    Circles.map(state.circles, (id, circle) => {
        const d =
            state.selected === id && state.diameter ? state.diameter : circle.d
        return f({ ...circle, d, id })
    })

const HoverCircles = (state, { rect, event }) => ({
    ...state,
    selected: Circles.find(state.circles, {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    }),
})

const ClickCircles = (state, { rect, event }) => {
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const circle = Circles.find(state.circles, { x, y })
    if (circle)
        return {
            ...state,
            popup: {
                mode: 'menu',
                x: event.pageX,
                y: event.pageY,
            },
        }
    const circles = Circles.add(state.circles, { x, y })
    const selected = Circles.lastId(circles)
    return { ...state, circles, selected }
}

const AreaMouseDown = (state, event) => {
    if (state.popup && state.popup.mode === 'menu') {
        return { ...state, popup: null }
    }
    if (state.popup && state.popup.mode === 'diameter') {
        return {
            ...state,
            popup: null,
            diameter: null,
            circles: Circles.setDiameter(
                state.circles,
                state.selected,
                state.diameter
            ),
        }
    }
    return [
        state,
        GetRect('circlearea', [ClickCircles, rect => ({ rect, event })]),
    ]
}

const AreaMouseMove = (state, event) => {
    if (state.popup) return state
    return [
        state,
        GetRect('circlearea', [HoverCircles, rect => ({ rect, event })]),
    ]
}

const OpenEditDiameter = (state, event) => {
    return [
        {
            ...state,
            popup: { ...state.popup, mode: 'diameter' },
            diameter: Circles.getDiameter(state.circles, state.selected),
        },
    ]
}

const SetDiameter = (state, diameter) => ({ ...state, diameter })

const Undo = state =>
    state.popup ? state : { ...state, circles: Circles.undo(state.circles) }

const Redo = state =>
    state.popup ? state : { ...state, circles: Circles.redo(state.circles) }

const PopUp = (props, content) =>
    h(
        'div',
        {
            class: 'popup-container',
            style: { top: props.y + 'px', left: props.x + 'px' },
        },
        content
    )

app({
    node: document.getElementById('app-circles'),
    init: {
        diameter: null,
        popup: null,
        selected: null,
        circles: Circles.init(),
    },
    view: state =>
        h('div', {}, [
            state.popup &&
                state.popup.mode === 'diameter' &&
                PopUp(
                    {
                        x: state.popup.x,
                        y: state.popup.y,
                    },
                    [
                        'Edit diameter',
                        h('br', {}),
                        h('input', {
                            type: 'range',
                            value: state.diameter,
                            oninput: [SetDiameter, targetValue],
                            max: MAX_DIAMETER,
                            min: MIN_DIAMETER,
                        }),
                    ]
                ),
            state.popup &&
                state.popup.mode === 'menu' &&
                PopUp({ x: state.popup.x, y: state.popup.y }, [
                    h('button', { onclick: OpenEditDiameter }, 'Edit Diameter'),
                ]),
            h('p', {}, [
                h('button', { onclick: Undo, disabled: !canUndo(state) }, [
                    'Undo',
                ]),
                h('button', { onclick: Redo, disabled: !canRedo(state) }, [
                    'Redo',
                ]),
            ]),
            h(
                'svg',
                {
                    id: 'circlearea',
                    width: 400,
                    height: 400,
                    viewBox: `0 0 400 400`,
                    onmousemove: AreaMouseMove,
                    onmousedown: AreaMouseDown,
                },
                mapCircles(state, circle =>
                    h('circle', {
                        class: { selected: state.selected === circle.id },
                        cx: circle.x,
                        cy: circle.y,
                        r: circle.d / 2,
                    })
                )
            ),
        ]),
})
