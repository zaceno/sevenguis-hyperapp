import test from 'ava'
import { init, set, get, evaluate } from '../index.js'

test('evaluate formula, =0.34', t => {
    const formula = '=0.34'
    const expected = '0.34'
    const cell = 'A1'
    let x = init()
    x = set(x, cell, formula)
    t.is(evaluate(x, cell), expected)
})

test('evaluate invalid expression', t => {
    const cell = 'A1'
    let x = init()
    x = set(x, cell, '=foobar')
    t.is(evaluate(x, cell), '#ERROR#')
})

test('evaluate formula, =C4', t => {
    let x = init()
    x = set(x, 'C4', '32')
    x = set(x, 'A1', '=C4')
    t.is(evaluate(x, 'A1'), '32')
})

test('evaluate formula, =SUM(2,2)', t => {
    let x = init()
    x = set(x, 'A1', '=SUM( 2, 2 )')
    t.is(evaluate(x, 'A1'), '4')
})

test('evaluate formula, =SUM(2,C4)', t => {
    let x = init()
    x = set(x, 'C4', '3')
    x = set(x, 'A1', '=SUM(2, C4)')
    t.is(evaluate(x, 'A1'), '5')
})

test('evaluate formula, =SUM(2,C4:C7,D3)', t => {
    let x = init()
    x = set(x, 'c4', '3')
    x = set(x, 'c5', '14')
    x = set(x, 'c7', '25')
    x = set(x, 'd3', '36')
    x = set(x, 'a1', '=Sum(2, c4:c7, d3)')
    t.is(evaluate(x, 'A1'), '80')
})

test('formula with 2d range =SUM(A1:B2', t => {
    let x = init()
    x = set(x, 'a1', '1')
    x = set(x, 'a2', '12')
    x = set(x, 'b2', '23')
    x = set(x, 'c3', '=SUM(A1:B2)')
    t.is(evaluate(x, 'c3'), '36')
})

test('formula with 2d range =SUM(A2:B1)', t => {
    let x = init()
    x = set(x, 'a1', '1')
    x = set(x, 'a2', '12')
    x = set(x, 'b2', '23')
    x = set(x, 'c3', '=SUM(A2:B1)')
    t.is(evaluate(x, 'c3'), '36')
})

test('formula with 2d range =SUM(B1:A2)', t => {
    let x = init()
    x = set(x, 'a1', '1')
    x = set(x, 'a2', '12')
    x = set(x, 'b2', '23')
    x = set(x, 'c3', '=SUM(B1:A2)')
    t.is(evaluate(x, 'c3'), '36')
})

test('formula with 2d range =SUM(B2:A1)', t => {
    let x = init()
    x = set(x, 'a1', '1')
    x = set(x, 'a2', '12')
    x = set(x, 'b2', '23')
    x = set(x, 'c3', '=SUM(B2:A1)')
    t.is(evaluate(x, 'c3'), '36')
})

test('evaluate formula, =PROD(2,2)', t => {
    let x = init()
    x = set(x, 'a1', '=PROD(2, 2)')
    t.is(evaluate(x, 'a1'), '4')
})

test('evaluate formula, =PROD(2,C4)', t => {
    let x = init()
    x = set(x, 'a1', '=PROD(2, C4)')
    x = set(x, 'c4', '3')
    t.is(evaluate(x, 'a1'), '6')
})
test('evaluate formula, =PROD(2,C4:C6,D3)', t => {
    let x = init()
    x = set(x, 'a1', '=PROD(2, C4:C6, D3)')
    x = set(x, 'c4', '0.3')
    x = set(x, 'c5', '5')
    x = set(x, 'c6', '7')
    x = set(x, 'd3', '1.1')
    t.is(evaluate(x, 'a1'), '23.1')
})

test('evaluate formula, =DIV(4,2)', t => {
    let x = init()
    x = set(x, 'a1', '=Div(4, 2)')
    t.is(evaluate(x, 'a1'), '2')
})

test('evaluate formula, =DIV(4,C4)', t => {
    let x = init()
    x = set(x, 'a1', '=DIV(4, C4)')
    x = set(x, 'C4', '2')
    t.is(evaluate(x, 'a1'), '2')
})

test('evaluate formula, =DIV(C3,D5)', t => {
    let x = init()
    x = set(x, 'a1', '=DIV(C3, C4)')
    x = set(x, 'C3', '6')
    x = set(x, 'C4', '2')
    t.is(evaluate(x, 'a1'), '3')
})

test('evaluate formula, =DIV(C3:C4)', t => {
    let x = init()
    x = set(x, 'a1', '=DIV(C3:C4)')
    x = set(x, 'C3', '6')
    x = set(x, 'C4', '2')
    t.is(evaluate(x, 'a1'), '3')
})

test('evaluate formula, =SUB(5,2)', t => {
    let x = init()
    x = set(x, 'a1', '=sub(5, 2)')
    t.is(evaluate(x, 'A1'), '3')
})
test('evaluate formula, =SUB(5,C4)', t => {
    let x = init()
    x = set(x, 'a1', '=sub(5, c4)')
    x = set(x, 'c4', '2')
    t.is(evaluate(x, 'a1'), '3')
})

test('evaluate formula, =SUB(C3,D5)', t => {
    let x = init()
    x = set(x, 'a1', '=sub(c3, d5)')
    x = set(x, 'c3', '5')
    x = set(x, 'd5', '2')
    t.is(evaluate(x, 'a1'), '3')
})

test('evaluate formula, =SUB(C3:C4)', t => {
    let x = init()
    x = set(x, 'a1', '=sub(c3:c4)')
    x = set(x, 'c3', '5')
    x = set(x, 'c4', '2')
    t.is(evaluate(x, 'a1'), '3')
})

//error for invalid function
test('evaluate bad function, =ZAP(C3:C9)', t => {
    let x = init()
    x = set(x, 'A1', '=ZAP(C3:C9)')
    x = set(x, 'C3', '1')
    x = set(x, 'C5', '4')
    x = set(x, 'C9', '9')
    t.is(evaluate(x, 'A1'), '#ERROR#')
})

//error for plain string value
test('evaluate formula, =SUM(2, foo)', t => {
    let x = init()
    x = set(x, 'a1', '=sum(foo, 2)')
    t.is(evaluate(x, 'a1'), '#ERROR#')
})
test('evaluate formula, =DIV(2, foo)', t => {
    let x = init()
    x = set(x, 'a1', '=DIV(foo, 2)')
    t.is(evaluate(x, 'a1'), '#ERROR#')
})
test('evaluate formula, =PROD(2, foo)', t => {
    let x = init()
    x = set(x, 'a1', '=PROD(foo, 2)')
    t.is(evaluate(x, 'a1'), '#ERROR#')
})
test('evaluate formula, =SUB(2, foo)', t => {
    let x = init()
    x = set(x, 'a1', '=sub(foo, 2)')
    t.is(evaluate(x, 'a1'), '#ERROR#')
})

//error for divide by zero
test('evaluate formula, =DIV( divide by zero )', t => {
    let x = init()
    x = set(x, 'a1', '=div(c3:c4)')
    x = set(x, 'c3', '5')
    x = set(x, 'c4', '0')
    t.is(evaluate(x, 'a1'), '#ERROR#')
})

//error for args length too long
test('evaluate formula, =SUB(C3:C9)', t => {
    let x = init()
    x = set(x, 'a1', '=SUB(c3:c9)')
    x = set(x, 'C3', '5')
    x = set(x, 'C4', '2')
    x = set(x, 'C9', '2')
    t.is(evaluate(x, 'a1'), '#ERROR#')
})

test('evaluate formula, =DIV(C3:C9)', t => {
    let x = init()
    x = set(x, 'a1', '=DIV(C3:C9)')
    x = set(x, 'C3', '6')
    x = set(x, 'C4', '2')
    x = set(x, 'C9', '2')
    t.is(evaluate(x, 'A1'), '#ERROR#')
})

//error, range cannot be top expression
test('evaluate formula, =C4:C11', t => {
    let x = init()
    x = set(x, 'a1', '=C4:C11')
    t.is(evaluate(x, 'a1'), '#ERROR#')
})

//error for cyclical references in formulas
test('evaluate formula, nested functions', t => {
    let x = init()
    x = set(x, 'a1', '=DIV(PROD(SUM(C1, D3:F3), 2), SUB(C1, 3))')
    x = set(x, 'C1', '5')
    x = set(x, 'D3', '1')
    x = set(x, 'E3', '1')
    x = set(x, 'F3', '1')
    t.is(evaluate(x, 'A1'), '8')
})

test('evaluate nested formulas', t => {
    let x = init()
    x = set(x, 'A1', '=SUM(C3, B1)')
    x = set(x, 'B1', '=PROD(C3, 2)')
    x = set(x, 'C3', '3')
    t.is(evaluate(x, 'B1'), '6')
    t.is(evaluate(x, 'A1'), '9')
})

test('empty formula', t => {
    let x = init()
    x = set(x, 'a1', '=')
    t.is(evaluate(x, 'a1'), '#ERROR#')
})

test('evaluate nested formula with cyclical references', t => {
    let x = init()
    x = set(x, 'A1', '=SUM(1, B1)')
    x = set(x, 'B1', '=SUM(1, C1)')
    x = set(x, 'C1', '=SUM(1, A1)')
    t.is(evaluate(x, 'A1'), '#ERROR#')
    t.is(evaluate(x, 'B1'), '#ERROR#')
    t.is(evaluate(x, 'C1'), '#ERROR#')
})

test('evaluate formula =B1', t => {
    let x = init()
    x = set(x, 'A1', '=B1')
    x = set(x, 'B1', '=C1')
    x = set(x, 'C1', '42')
    t.is(evaluate(x, 'A1'), '42')
})

test('evaluate formula =B1 references NaN', t => {
    let x = init()
    x = set(x, 'A1', '=B1')
    x = set(x, 'B1', '=C1')
    x = set(x, 'C1', 'foo')
    t.is(evaluate(x, 'A1'), '#ERROR#')
})

test('error when referred formula has syntax error', t => {
    let x = init()
    x = set(x, 'A1', '=B1')
    x = set(x, 'B1', '=SUM)1(')
    t.is(evaluate(x, 'A1'), '#ERROR#')
})

test('evaluate nested formula with cyclical references where the starting node is not in the cycle', t => {
    let x = init()
    x = set(x, 'A1', '=B1')
    x = set(x, 'B1', '=SUM(1, C1)')
    x = set(x, 'C1', '=D1')
    x = set(x, 'D1', '=SUM(1, B1)')
    t.is(evaluate(x, 'A1'), '#ERROR#')
})

test('Forumula with range, where one in range is a formula', t => {
    let x = init()
    x = set(x, 'A1', '=SUM(B1:B10)')
    x = set(x, 'B1', '=C1')
    x = set(x, 'C1', '42')
    t.is(evaluate(x, 'A1'), '42')
})

test('Formula with bad range', t => {
    let x = init()
    x = set(x, 'A1', '=foo:bar')
    t.is(evaluate(x, 'A1'), '#ERROR#')
})
