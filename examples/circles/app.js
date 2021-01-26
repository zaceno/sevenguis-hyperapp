import { app } from 'https://unpkg.com/hyperapp'
import html from 'https://unpkg.com/hyperlit'
import * as store from '../../lib/data/history-collection-store.js'
import * as Modal from '../../lib/components/modal.js'
import withCoords from '../../lib/with-coords.js'
import onResize from '../../lib/io/on-resize.js'
import getRect from '../../lib/io/get-rect.js'

const DEFAULT_RADIUS = 50

// ---- DIAMETER EDTING MODAL ---

const modal = Modal.wire({
    get: (s) => s.modal,
    set: (s, modal) => ({ ...s, modal }),
})

const DoneEditing = (state) => {
    if (!state.editing) return state
    let circles = state.circles
    let theCircle = store.get(circles, state.editing)
    if (theCircle.r !== state.diameter / 2) {
        circles = store.set(circles, state.editing, {
            ...theCircle,
            r: state.diameter / 2,
        })
    }
    return modal.close({
        ...state,
        circles,
        editing: null,
        diameter: null,
    })
}

const SetDiameter = (state, diameter) => ({ ...state, diameter })

const editDiameterModal = (state) => html`
    <${Modal.view}
        ${modal.model(state)}
        ClickOutside=${DoneEditing}
        >
        <p style=${{ width: '180px', marginLeft: '20px' }}>
            <label key=${state.editing}>
                <span>Edit diameter:</span>
                <br />
                <input
                    type="range"
                    min="20"
                    max="300"
                    step="2"
                    value=${state.diameter}
                    oninput=${(_, ev) => [SetDiameter, ev.target.value]}
                />
                <span>${state.diameter}</span>
            </label>
        </p>
    </${modal.view}>`

// ---- DRAWING AREA ---

const ClickHandler = (state, { x, y }) => {
    if (!state.hovered) {
        const circles = store.add(state.circles, { x, y, r: DEFAULT_RADIUS })
        const hovered = store.lastId(circles)
        return {
            ...state,
            hovered,
            circles,
        }
    } else {
        return modal.open({
            ...state,
            editing: state.hovered,
            diameter: store.get(state.circles, state.hovered).r * 2,
        })
    }
}

const HoverCircle = (state, { x, y }) => {
    let hovered = store
        .map(state.circles, (id, item) => {
            let dx = x - item.x
            let dy = y - item.y
            let d2 = dx * dx + dy * dy
            let r2 = item.r * item.r
            return { id, d2, r2 }
        })
        .filter(({ d2, r2 }) => d2 < r2)
        .sort((l, r) => l.d2 - r.d2)
    if (hovered.length) return { ...state, hovered: hovered[0].id }
    else return { ...state, hovered: null }
}

const circle = ({ cx, cy, r, highlight }) => html`
    <circle
        ${{ cx, cy, r }}
        stroke=${highlight ? '#00f' : '#000'}
        fill=${highlight ? 'rgba(128, 128, 255, 0.1)' : 'rgba(0,0,0,0.1)'}
    />
`

const drawingArea = (state) => html`
    <svg
        style=${{ border: '1px black solid' }}
        viewBox="0 0 ${state.viewBox.width} ${state.viewBox.height}"
        width="100%"
        height="300px"
        onclick=${withCoords(ClickHandler)}
        onmousemove=${withCoords(HoverCircle)}
    >
        ${store.map(state.circles, (id, { x, y, r }) =>
            circle({
                cx: x,
                cy: y,
                r: state.editing === id ? state.diameter / 2 : r,
                highlight: state.hovered === id,
            })
        )}
    </svg>
`

// ---- UNDO HISTORY TOOLBAR ---

const Undo = (state) => ({ ...state, circles: store.undo(state.circles) })

const Redo = (state) => ({ ...state, circles: store.redo(state.circles) })

const toolbar = (state) => html`
    <p>
        <button disabled=${!store.canUndo(state.circles)} onclick=${Undo}>
            Undo
        </button>
        <button disabled=${!store.canRedo(state.circles)} onclick=${Redo}>
            Redo
        </button>
    </p>
`

// ----- MAIN APP -----

const initialState = {
    hovered: null,
    editing: null,
    circles: store.init(),
    modal: Modal.init(),
    viewBox: { width: 0, height: 0 },
}

const updateViewBox = getRect('.app-circles svg', (s, viewBox) => ({
    ...s,
    viewBox,
}))

const appView = (state) => html`
    <div class="app app-circles">
        <${editDiameterModal} ${state} />
        <${toolbar} ${state} />
        <${drawingArea} ${state} />
    </div>
`

export default (node) =>
    app({
        node,
        init: [initialState, updateViewBox],
        subscriptions: () => [onResize((s) => [s, updateViewBox])],
        view: appView,
    })
