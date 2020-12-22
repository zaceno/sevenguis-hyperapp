function init(list = []) {
    return list.reduce((state, item) => add(state, item), {
        count: 0,
        items: 0,
    })
}

function add(state, item) {
    const count = state.count + 1
    const id = 'x' + count
    return {
        count,
        items: {
            ...state.items,
            ['x' + count]: item,
        },
    }
}

function exists(state, id) {
    return state.items[id] !== undefined
}

function get(state, id) {
    const i = state.items[id]
    if (i === undefined) return null
    return i
}

function set(state, id, item) {
    if (!exists(state, id)) return state
    return {
        ...state,
        items: {
            ...state.items,
            [id]: item,
        },
    }
}

function remove(state, id) {
    if (!exists(state, id)) return state
    const items = { ...state.items }
    delete items[id]
    return { ...state, items }
}

function lastId(state) {
    return 'x' + state.count
}

function map(state, f) {
    return Object.keys(state.items).map((id) => f(id, state.items[id]))
}

export { init, exists, add, remove, set, get, map, lastId }
