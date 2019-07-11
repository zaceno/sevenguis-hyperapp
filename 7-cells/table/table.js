import { valid } from './refs.js'

export function init() {
    return {}
}

export function get(table, name) {
    name = name.toUpperCase()
    if (!valid(name)) return null
    if (table[name] === undefined) return ''
    return table[name]
}

export function set(table, name, value) {
    name = name.toUpperCase()
    if (!valid(name)) return table
    return { ...table, [name]: value }
}
