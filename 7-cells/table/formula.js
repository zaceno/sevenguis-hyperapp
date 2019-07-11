import parser from './parser.js'
import { get } from './table.js'
import { range } from './refs.js'

const ERROR = Symbol()

export default function(table, formula) {
    try {
        return formulaValue(table, [], formula)
    } catch (e) {
        if (e === ERROR) return '#ERROR#'
        throw e
    }
}

function cellValue(table, stack, name) {
    let value = get(table, name)
    if (value === null) throw ERROR
    if (value === '') return null
    if (!isNaN(value)) return +value
    if (value[0] === '=')
        return formulaValue(table, stackAdd(stack, name), value.slice(1))
    throw ERROR
}

function stackAdd(stack, name) {
    name = name.toUpperCase()
    if (stack.indexOf(name) > -1) throw ERROR
    return [...stack, name]
}

function formulaValue(table, stack, str) {
    let node = parser(str)
    if (!node) throw ERROR
    let value = nodeValue(table, stack, node)
    if (!isNaN(value)) return +value
    throw ERROR
}

function nodeValue(table, stack, node) {
    if (node.children) return fnValue(table, stack, node.name, node.children)
    if (!isNaN(node)) return +node
    let ends = node.split(':')
    if (ends.length > 2) throw ERROR
    if (ends.length === 2) {
        let list = range(...ends)
        if (!list) throw ERROR
        return list.map(n => cellValue(table, stack, n))
    }
    return cellValue(table, stack, node)
}

function fnValue(table, stack, name, args) {
    name = name.toUpperCase()
    args = args
        .map(arg => nodeValue(table, stack, arg))
        .reduce((a, x) => a.concat(x), [])
        .filter(x => x !== null)
    if (name === 'SUM') return args.reduce((t, x) => x + t, 0)
    if (name === 'PROD') return args.reduce((t, x) => x * t, 1)
    if (args.length !== 2) throw ERROR
    if (name === 'SUB') return args[0] - args[1]
    if (name === 'DIV' && args[1] !== 0) return args[0] / args[1]
    throw ERROR
}
