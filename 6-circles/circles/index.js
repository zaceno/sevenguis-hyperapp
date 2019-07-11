import * as Collection from '../../lib/data/collection/history.js'

export const DEFAULT_DIAMETER = 80
export const init = Collection.init
export const canUndo = Collection.canUndo
export const canRedo = Collection.canRedo
export const undo = Collection.undo
export const redo = Collection.redo
export const lastId = Collection.lastId
export const map = Collection.map

export const add = (state, { x, y }) =>
    Collection.add(state, { x, y, d: DEFAULT_DIAMETER })

export const setDiameter = (state, id, diameter) =>
    Collection.set(state, id, {
        ...Collection.get(state, id),
        d: diameter,
    })

export const getDiameter = (state, id) => Collection.get(state, id).d

export const find = (state, { x, y }) => {
    const empty = { id: null, d2: null }
    return Collection.map(state, (id, c) => ({ id, ...c }))
        .filter(c => {
            const dx = c.x - x
            const dy = c.y - y
            const d2 = dx * dx + dy * dy
            const r2 = (c.d * c.d) / 4
            return d2 < r2
        })
        .reduce((min, c) => {
            if (min === empty) return c
            if (min.d2 > x.d2) return c
            return min
        }, empty).id
}
