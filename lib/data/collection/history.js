import * as History from '../history/index.js'
import * as Collection from './index.js'

const { canUndo, canRedo, undo, redo } = History
const init = () => History.init(Collection.init())
const add = (state, item) =>
    History.commit(state, Collection.add(History.current(state), item))
const set = (state, id, item) =>
    History.commit(state, Collection.set(History.current(state), id, item))
const exists = (state, id) => Collection.exists(History.current(state), id)
const remove = (state, id) =>
    History.commit(state, Collection.remove(History.current(state), id))
const get = (state, id) => Collection.get(History.current(state), id)
const map = (state, f) => Collection.map(History.current(state), f)
const lastId = state => Collection.lastId(History.current(state))

export {
    canUndo,
    canRedo,
    undo,
    redo,
    init,
    add,
    set,
    exists,
    remove,
    get,
    map,
    lastId,
}
