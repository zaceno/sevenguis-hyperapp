import { h } from 'https://unpkg.com/hyperapp'
import withCoords from '../with-coords.js'
import style from '../add-stylesheet.js'

const defaultState = {
    x: null,
    y: null,
    dx: null,
    dy: null,
    open: false,
    dragging: false,
}

const init = () => defaultState

const open = () => ({ ...defaultState, open: true })

const close = () => defaultState

const startDrag = (state, { x, y }) =>
    !state.open ? state : { ...state, dx: x, dy: y, dragging: true }

const stopDrag = (state) =>
    !state.dragging ? state : { ...state, dragging: false }

const drag = (state, { x, y }) =>
    !state.dragging ? state : { ...state, x: x - state.dx, y: y - state.dy }

const wire = ({ get, set }) => {
    const _open = (state) => set(state, open(get(state)))
    const _close = (state) => set(state, close(get(state)))
    const DragStart = withCoords((state, coords) =>
        set(state, startDrag(get(state), coords))
    )
    const DragEnd = (state) => set(state, stopDrag(get(state)))
    const DragMove = withCoords((state, coords) =>
        set(state, drag(get(state), coords))
    )
    return {
        open: _open,
        close: _close,
        model: (state) => ({
            ...get(state),
            DragStart,
            DragEnd,
            DragMove,
        }),
    }
}

const view = (
    { open, x, y, DragStart, DragEnd, DragMove, ClickOutside },
    content
) =>
    h(
        'div',
        {
            class: 'modal modal-backdrop',
            key: 'modal',
            hidden: !open,
            onclick: (state, ev) =>
                ev.currentTarget === ev.target ? [ClickOutside, ev] : state,
            onmousemove: DragMove,
        },
        [
            h(
                'div',
                {
                    class: 'modal-outercontainer',
                    style: {
                        left: x !== null ? '' + x + 'px' : undefined,
                        top: y !== null ? '' + y + 'px' : undefined,
                    },
                },
                [
                    h('div', {
                        class: 'modal-draggable',
                        onmousedown: DragStart,
                        onmouseup: DragEnd,
                    }),
                    h('div', { class: 'modal-innercontainer' }, content),
                ]
            ),
        ]
    )
export { view, wire, init }

style(`
	.modal-backdrop {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0,0,0,0.1);
	}
	
	.modal-outercontainer {
		border-radius: 5px;
		border: 1px #000 solid;
		box-shadow: 0px 0px 15px rgba(0,0,0,0.7);
		overflow: hidden;
		position: absolute;
		left: calc(50% - 100px);
		top: calc(50% - 50px);        
		background-color: #fff;
	}
	
	.modal .modal-draggable {
		background: linear-gradient(
			180deg,
			#fff 1px,
			#ccc 1px,
			#ccc 3px,
			#fff 3px,
			#fff 5px,
			#ccc 5px,
			#ccc 7px,
			#fff 7px,
			#fff 9px,
			#ccc 9px,
			#ccc 11px,
			#fff 11px
		);
		cursor: grab;
		height: 20px;
	}
	`)
