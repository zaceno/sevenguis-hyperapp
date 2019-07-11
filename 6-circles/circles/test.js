import test from 'ava'
import * as Circles from './index.js'

test('add', t => {
    let x = Circles.init()
    x = Circles.add(x, { x: 10, y: 20 })
    t.deepEqual(Circles.map(x, (id, c) => c), [
        {
            x: 10,
            y: 20,
            d: Circles.DEFAULT_DIAMETER,
        },
    ])
})

test('setDiameter', t => {
    let x = Circles.init()
    x = Circles.add(x, { x: 10, y: 20 })
    let id = Circles.lastId(x)
    x = Circles.setDiameter(x, id, 98765)
    t.deepEqual(Circles.map(x, (id, c) => c), [
        {
            x: 10,
            y: 20,
            d: 98765,
        },
    ])
})

test('getDiameter', t => {
    let x = Circles.init()
    x = Circles.add(x, { x: 10, y: 20 })
    let id = Circles.lastId(x)
    x = Circles.setDiameter(x, id, 98765)
    t.is(Circles.getDiameter(x, id), 98765)
})

test('find - fail', t => {
    let x = Circles.init()
    x = Circles.add(x, { x: 300, y: 300 })
    x = Circles.add(x, { x: 310, y: 300 })
    x = Circles.add(x, { x: 300, y: 310 })
    x = Circles.add(x, { x: 310, y: 310 })
    t.is(Circles.find(x, { x: 10, y: 10 }), null)
})
test('find - one hit', t => {
    let x = Circles.init()
    x = Circles.add(x, { x: 20, y: 20 })
    const id = Circles.lastId(x)
    x = Circles.add(x, { x: 310, y: 300 })
    x = Circles.add(x, { x: 300, y: 310 })
    x = Circles.add(x, { x: 310, y: 310 })
    t.is(Circles.find(x, { x: 10, y: 10 }), id)
})
test('find - nearest of multiple hits', t => {
    let x = Circles.init()
    x = Circles.add(x, { x: 300, y: 300 })
    const id = Circles.lastId(x)
    x = Circles.add(x, { x: 310, y: 300 })
    x = Circles.add(x, { x: 300, y: 310 })
    x = Circles.add(x, { x: 310, y: 310 })
    t.is(Circles.find(x, { x: 301, y: 301 }), id)
})
