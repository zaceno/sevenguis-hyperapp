import * as Refs from './refs.js'
import {
    ERROR_VALUE,
    EMPTY_VALUE,
    getFormulaDependencies,
    calculateFormula,
} from './formula.js'

const ERROR_STRING = '#ERROR#'
const EMPTY_STRING = ''

export const valid = Refs.valid
export const offset = Refs.offset
export const rows = Refs.rows
export const cols = Refs.cols
export const cells = Refs.cells

export function init(data = {}) {
    return Object.keys(data).reduce((DS, name) => set(DS, name, data[name]), {})
}

export function get(DS, name) {
    name = name.toUpperCase()
    if (!Refs.valid(name)) return null
    if (DS[name]) return DS[name].value
    return ''
}

export function evaluate(DS, name) {
    name = name.toUpperCase()
    if (!Refs.valid(name)) return null
    if (!(name in DS)) return ''
    const cell = DS[name]
    if (cell.type === 'error') return ERROR_STRING
    if (cell.type === 'empty') return EMPTY_STRING
    if (cell.type === 'number') {
        if (cell.calc === EMPTY_VALUE) return EMPTY_STRING
        return '' + cell.calc
    }
    if (cell.type === 'string') return cell.value
}

export function set(DS, name, string) {
    name = name.toUpperCase()

    if (!Refs.valid(name)) return DS //just ignore a wierd set().

    DS = clear(
        {
            ...DS,
            [name]: {
                value: string,
                calc: null,
                deps: [],
                type: null,
            },
        },
        name
    )
    return getUncalculated(DS).reduce((DS, n) => calculate(DS, n, []), DS)
}

function clear(DS, name) {
    DS = {
        ...DS,
        [name]: {
            ...DS[name],
            type: null,
            calc: null,
        },
    }
    return Object.keys(DS)
        .filter(name2 => DS[name2].deps.indexOf(name) > -1)
        .reduce(clear, DS)
}

function getUncalculated(DS) {
    return Object.keys(DS).filter(name => {
        return DS[name].type === null
    })
}

function calculate(DS, name, stack) {
    name = name.toUpperCase()
    const value = get(DS, name)
    if (name in DS && DS[name].type !== null) return DS //already calculated this cell
    if (stack.indexOf(name) > -1) {
        return {
            ...DS,
            [name]: {
                ...DS[name],
                type: 'error',
                calc: ERROR_VALUE,
            },
        }
    } else {
        stack = [...stack, name]
    }

    let type,
        calc,
        deps = []
    if (!value) {
        type = 'empty'
        calc = EMPTY_VALUE
    } else if (!isNaN(value)) {
        type = 'number'
        calc = +value
    } else if (value[0] !== '=') {
        type = 'string'
        calc = value
    } else {
        deps = []
        const depVals = {}
        getFormulaDependencies(value.slice(1)).forEach(name => {
            if (name.indexOf(':') > 1) {
                let cells = Refs.range(name)
                if (cells === null) {
                    depVals[name] = ERROR_VALUE
                } else {
                    DS = cells.reduce((DS, n) => calculate(DS, n, stack), DS)
                    deps = [...deps, ...cells]
                    depVals[name] = cells.map(n => getCalc(DS, n))
                }
            } else if (Refs.valid(name)) {
                DS = calculate(DS, name, stack)
                deps = [...deps, name.toUpperCase()]
                depVals[name] = getCalc(DS, name)
            } else {
                depVals[name] = ERROR_VALUE
            }
        })
        calc = calculateFormula(value.slice(1), depVals)
        if (calc === ERROR_VALUE) type = 'error'
        else type = 'number'
    }
    return { ...DS, [name]: { value, type, calc, deps } }
}

function getCalc(DS, name) {
    name = name.toUpperCase()
    if (name in DS) return DS[name].calc
    return EMPTY_VALUE
}
