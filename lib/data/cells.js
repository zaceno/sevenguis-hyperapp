import * as valueStore from './reactive-store.js'

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'

const FUNCTIONS = {
    prod: (...args) =>
        args
            .filter((a) => a !== undefined)
            .reduce((t, a) => {
                if (isNaN(a)) throw new Error(`${a} is not a number`)
                return t * a
            }, 1),
    sum: (...args) =>
        args
            .filter((a) => a !== undefined)
            .reduce((t, a) => {
                if (isNaN(a)) throw new Error(`${a} is not a number`)
                return t + a
            }, 0),
    sub: (a, b, ...extra) => {
        if (
            a === undefined ||
            isNaN(a) ||
            b === undefined ||
            isNaN(b) ||
            extra.length
        )
            throw new Error('SUB got bad arguments')
        return a - b
    },
    div: (a, b, ...extra) => {
        if (
            a === undefined ||
            isNaN(a) ||
            b === undefined ||
            isNaN(b) ||
            b == 0 ||
            extra.length
        )
            throw new Error(`Cannot divide ${a} / ${b}`)
        return a / b
    },
}

const parse = (str) => {
    let buffer = '',
        current = { children: [] },
        next
    for (var i = 0; i < str.length; i++) {
        let ch = str[i]
        if (ch === ' ' || ch === '\t' || ch === '\n') continue
        if (ch === '(') {
            if (!buffer) throw 'error'
            current.children.push(
                (next = { parent: current, name: buffer, children: [] })
            )
            current = next
            buffer = ''
        } else if (ch === ')' || ch === ',') {
            buffer && current.children.push(buffer)
            buffer = ''
            if (!current.parent) throw 'error'
            if (ch === ')') {
                let parent = current.parent
                delete current.parent
                current = parent
            }
        } else buffer += ch
    }
    let ret = current.children[0] || buffer
    if (!ret) throw 'error'
    return ret
}

function coords(name) {
    name = name.toLowerCase()
    if (!name || name.length < 2) throw new Error(`coord ${name} invalid`)
    const col = LETTERS.indexOf(name.slice(0, 1))
    if (col < 0) throw new Error(`coord ${name} invalid`)
    const row = +name.slice(1)
    if (isNaN(row) || row < 1 || row > 99)
        throw new Error(`coord ${name} invalid`)
    return { row, col }
}

const resolveRanges = (arr) =>
    arr
        .map((arg) => {
            if (typeof arg !== 'string') return arg
            let ends = arg.split(':')
            if (ends.length === 1) return arg
            if (ends.length > 2)
                throw new Error(`Range specifier ${arg} invalid`)
            let pa = coords(ends[0])
            let pb = coords(ends[1])
            let { row: aRow, col: aCol } = pa
            let { row: bRow, col: bCol } = pb
            let startRow = Math.min(aRow, bRow)
            let endRow = Math.max(aRow, bRow)
            let startCol = Math.min(aCol, bCol)
            let endCol = Math.max(aCol, bCol)
            let list = []
            for (let i = startCol; i <= endCol; i++) {
                for (let j = startRow; j <= endRow; j++) {
                    list.push(LETTERS[i] + j)
                }
            }
            return list
        })
        .flat()

const resolveNode = (node, getter) =>
    node.name
        ? FUNCTIONS[node.name.toLowerCase()](
              ...resolveRanges(node.children).map((node) =>
                  resolveNode(node, getter)
              )
          )
        : isNaN(node)
        ? (coords(node), getter(node))
        : +node

const calcFormula = (text, getter) => {
    try {
        let ret = resolveNode(parse(text.toLowerCase()), getter)
        if (ret === undefined) throw new Error(`${text} is undefined`)
        return ret
    } catch (e) {
        return '#ERROR#'
    }
}

export const COLS = LETTERS.split('')
export const ROWS = [...Array(99).keys()].map((x) => x + 1)
export const init = () => ({ texts: {}, values: valueStore.init() })
export const get = (table, key) => table.texts[key.toLowerCase()] || ''
export const evaluate = (
    table,
    key,
    x = valueStore.get(table.values, key.toLowerCase())
) => '' + (x === undefined ? '' : x)

export const set = ({ texts, values }, key, text) => {
    try {
        values = valueStore.set(
            values,
            key.toLowerCase(),
            text.trim() === ''
                ? ''
                : !isNaN(text)
                ? +text
                : text[0] === '='
                ? (g) => calcFormula(text.slice(1), g)
                : text
        )
    } catch (e) {
        values = valueStore.set(values, key.toLowerCase(), '#ERROR#')
    }
    return { texts: { ...texts, [key.toLowerCase()]: text }, values }
}
