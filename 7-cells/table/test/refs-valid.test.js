import test from 'ava'
import {valid} from '../refs'

test('invalid name', t => t.is(valid('foo'), false))
test('Out of range', t => t.is(valid('Z100'), false))
test('Valid Z99', t => t.is(valid('Z99'), true))
test('Valid A0', t => t.is(valid('A0'), true))
test('Valid z99', t => t.is(valid('z99'), true))
test('Valid a0', t => t.is(valid('a0'), true))