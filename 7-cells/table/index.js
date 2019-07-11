import { init, get, set } from './table.js'
import { rows, cols, cells, offset } from './refs.js'
import evaluateFormula from './formula.js'

function evaluate(table, name) {
    let val = get(table, name)
    if (val && val[0] === '=') return '' + evaluateFormula(table, val.slice(1))
    return val
}

export { init, get, set, evaluate, rows, cols, cells, offset }
