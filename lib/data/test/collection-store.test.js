import test from 'ava'
import * as Collection from '../collection-store.js'

test('init empty', t => {
    const x = Collection.init()
    t.deepEqual(
        Collection.map(x, id => id),
        [],
    )
})

test('init with list', t => {
    const values = ['a', 'b', 'c']
    const x = Collection.init(values)
    t.deepEqual(Collection.map(x, (id, val) => val).sort(), values)
})

test('add', t => {
    let x = Collection.init()
    x = Collection.add(x, 'a')
    x = Collection.add(x, 'b')
    x = Collection.add(x, 'c')
    t.deepEqual(Collection.map(x, (id, val) => val).sort(), ['a', 'b', 'c'])
})

test('get / lastId', t => {
    let x = Collection.init()
    x = Collection.add(x, 'a')
    x = Collection.add(x, 'b')
    x = Collection.add(x, 'c')
    let id = Collection.lastId(x)
    t.is(Collection.get(x, id), 'c')
})

test('set', t => {
    let x = Collection.init()
    x = Collection.add(x, 'a')
    let id = Collection.lastId(x)
    x = Collection.set(x, id, 'b')
    t.is(Collection.get(x, id), 'b')
})

test('remove', t => {
    let x = Collection.init()
    x = Collection.add(x, 'a')
    x = Collection.add(x, 'b')
    let bid = Collection.lastId(x)
    x = Collection.add(x, 'c')
    x = Collection.remove(x, bid)
    t.deepEqual(Collection.map(x, (id, val) => val).sort(), ['a', 'c'])
})

test('exists', t => {
    let x = Collection.init()
    x = Collection.add(x, 'a')
    let aid = Collection.lastId(x)
    x = Collection.add(x, 'b')
    let bid = Collection.lastId(x)
    x = Collection.add(x, 'c')
    t.is(Collection.exists(x, bid), true)
    x = Collection.remove(x, bid)
    t.is(Collection.exists(x, bid), false)
    t.is(Collection.exists(x, aid), true)
})

test('immutable add', t => {
    let x = Collection.init()
    let y = x
    x = Collection.add(x, 'a')
    let id = Collection.lastId(x)
    t.false(Collection.exists(y, id))
})

test('immutable set', t => {
    let x = Collection.init()
    x = Collection.add(x, 'a')
    let id = Collection.lastId(x)
    let y = x
    x = Collection.set(x, id, 'b')
    t.is(Collection.get(y, id), 'a')
})

test('immutable remove', t => {
    let x = Collection.init()
    x = Collection.add(x, 'a')
    let id = Collection.lastId(x)
    let y = x
    x = Collection.remove(x, id)
    t.true(Collection.exists(y, id))
})
