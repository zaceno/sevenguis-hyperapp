import parse from '../parser'
import test from 'ava'

//ERRORS
test('empty string', t => t.is(parse(''), null))
test('foo,', t => t.is(parse('foo,'), null))
test(',foo', t => t.is(parse(',foo'), null))
test('foo(', t => t.is(parse('foo('), null))
test('(foo,', t => t.is(parse('(foo,'), null))
test(')foo,', t => t.is(parse(')foo,'), null))
test('foo),', t => t.is(parse('foo),'), null))
test('bar,foo', t => t.is(parse('bar,foo'), null))
test('foo(bar,baz,)', t => t.is(parse('foo(bar,baz,)'), null))
test('foo(bar,,baz)', t => t.is(parse('foo(bar,,baz)'), null))

//Intended use tests
test('foo', t => {
    t.deepEqual(parse('foo'), 'foo')
})

test('foo()', t => {
    t.deepEqual(parse('foo()'), { name: 'foo', children: [] })
})

test('foo(bar)', t => {
    t.deepEqual(parse('foo(bar)'), {
        name: 'foo',
        children: ['bar'],
    })
})

test('foo(bar(baz, faz(fit, fop)),bing,bop())', t => {
    t.deepEqual(parse('foo(bar(baz, faz(fit, fop)),bing,bop())'), {
        name: 'foo',
        children: [
            {
                name: 'bar',
                children: ['baz', { name: 'faz', children: ['fit', 'fop'] }],
            },
            'bing',
            { name: 'bop', children: [] },
        ],
    })
})
