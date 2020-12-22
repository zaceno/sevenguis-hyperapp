import test from 'ava'
import * as History from '../history-store.js'

test('init', t => {
    const initial = 'foo'
    const state = History.init(initial)
    t.is(History.current(state), initial)
})

test('undo', t => {
    const first = 'first'
    const second = 'second'
    let x = History.init(first)
    x = History.commit(x, second)
    t.is(History.current(x), second)
    x = History.undo(x)
    t.is(History.current(x), first)
})
test('undo too much => initial', t => {
    const first = 'first'
    const second = 'second'
    let x = History.init(first)
    x = History.commit(x, second)
    x = History.undo(x)
    x = History.undo(x)
    t.is(History.current(x), first)
})

test('redo', t => {
    const first = 'first'
    const second = 'second'
    let x = History.init(first)
    x = History.commit(x, second)
    x = History.undo(x)
    x = History.undo(x) //extraneous
    x = History.redo(x)
    t.is(History.current(x), second)
})

test('redo too much => last state', t => {
    const first = 'first'
    const second = 'second'
    let x = History.init(first)
    x = History.commit(x, second)
    x = History.undo(x)
    x = History.redo(x)
    x = History.redo(x)
    t.is(History.current(x), second)
})

test('can undo?', t => {
    const first = 'first'
    const second = 'second'
    let x = History.init(first)
    x = History.commit(x, second)
    t.true(History.canUndo(x))
    x = History.undo(x)
    t.false(History.canUndo(x))
})

test('can redo?', t => {
    const first = 'first'
    const second = 'second'
    const third = 'third'
    let x = History.init(first)
    t.false(History.canRedo(x))
    x = History.commit(x, second)
    x = History.undo(x)
    t.true(History.canRedo(x))
    x = History.commit(x, third)
    t.false(History.canRedo(x))
})
