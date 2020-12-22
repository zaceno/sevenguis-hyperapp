export function init(initial) {
    return { undo: [], redo: [], current: initial }
}

export function canUndo(state) {
    return state.undo.length > 0
}

export function canRedo(state) {
    return state.redo.length > 0
}

export function undo(state) {
    if (!canUndo(state)) return state
    return {
        current: state.undo[0],
        undo: state.undo.slice(1),
        redo: [state.current, ...state.redo],
    }
}

export function redo(state) {
    if (!canRedo(state)) return state
    return {
        current: state.redo[0],
        redo: state.redo.slice(1),
        undo: [state.current, ...state.undo],
    }
}

export function current(state) {
    return state.current
}

export function commit(state, news) {
    return {
        undo: [state.current, ...state.undo],
        redo: [],
        current: news,
    }
}
