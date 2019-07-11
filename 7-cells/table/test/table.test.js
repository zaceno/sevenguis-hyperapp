import test from 'ava'
import { init, set, get, evaluate } from '../index.js'

test('init creates empty table', t => {
    const table = init()
    t.is(get(table, 'A0'), '')
    t.is(get(table, 'M0'), '')
    t.is(get(table, 'Z0'), '')
    t.is(get(table, 'A9'), '')
    t.is(get(table, 'M9'), '')
    t.is(get(table, 'Z9'), '')
    t.is(get(table, 'A49'), '')
    t.is(get(table, 'M49'), '')
    t.is(get(table, 'Z49'), '')
    t.is(get(table, 'A99'), '')
    t.is(get(table, 'M99'), '')
    t.is(get(table, 'Z99'), '')
})

test('bad reference returns null', t => {
    const table = init()
    t.is(get(table, ''), null, 'empty string')
    t.is(get(table, '$2'), null, 'wierd syntax')
    t.is(get(table, 'M3:M4'), null, 'range in get')
    t.is(get(table, 'M123'), null, 'out of range')
})

test('set value', t => {
    const val = 'foo'
    const ref = 'B27'
    t.is(get(set(init(), ref, val), ref), val)
})

test('set on bad reference returns unchanged table', t => {
    let x = init()
    t.is(set(x, 'B100', 'foo'), x)
})

test('evaluate bad reference', t => {
    t.is(evaluate(init(), '$2'), null)
})

test('evaluate cell with value', t => {
    const ref = 'B2'
    const val = 'foo'
    t.is(evaluate(set(init(), ref, val), ref), val)
})
