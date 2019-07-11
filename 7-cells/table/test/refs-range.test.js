import test from 'ava'
import {range} from '../refs'

test('invalid range foo:bar', t => t.is(range('foo', 'bar'), null))
test('invalid range C3:C100', t => t.is(range('C3', 'C100'), null))
test('invalid range C300:C1', t => t.is(range('C300', 'C1'), null))
test('range C3:C3', t => t.deepEqual(range('C3', 'c3'), ['C3']))
test('range C3:C4', t => t.deepEqual(range('c3', 'C4'), ['C3', 'C4']))
test('range C3:C11', t => t.deepEqual(
    range('C3','C11'),
    [
        'C3', 'C4', 'C5',
        'C6', 'C7', 'C8',
        'C9', 'C10', 'C11'
    ]
))
test('range c3:a5', t => t.deepEqual(
    range('A3','C5').sort(),
    [
        'A3', 'A4', 'A5',
        'B3', 'B4', 'B5',
        'C3', 'C4', 'C5'
    ]
))