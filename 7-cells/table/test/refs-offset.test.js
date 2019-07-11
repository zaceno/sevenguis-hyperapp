import test from 'ava'
import {offset} from '../refs'


test('offset invalid name', t => t.is(offset('foo', 3, 2), null))
test('offset row down', t => t.is(offset('M5', 0, 1), 'M6'))
test('offset row up', t => t.is(offset('m5', 0, -1), 'M4'))
test('offset col left', t => t.is(offset('m5', -1, 0), 'L5'))
test('offset col right', t => t.is(offset('M5', 1, 0), 'N5'))
test('offset multi', t => t.is(offset('C5', 3, -2), 'F3'))
test('offset too far left', t => t.is(offset('C5', -5, 2), 'A7'))
test('offset too far right', t => t.is(offset('Y5', 5, -2), 'Z3'))
test('offset too far up', t => t.is(offset('M3', 1, -5), 'N0'))
test('offset too far down', t => t.is(offset('M98', -1, 5), 'L99'))
