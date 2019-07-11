import * as Table from './table/index.js'
const cells = {
    A0: 'ITEM',
    A1: 'Widget',
    A2: 'Flange',
    A3: 'Turbox',
    A4: 'Knoblet',
    B0: 'UNITS',
    B1: '3',
    B2: '4',
    B3: '5',
    B4: '2',
    C0: 'PER UNIT',
    C1: '120',
    C2: '55',
    C3: '80',
    C4: '110',
    D0: 'TOTAL',
    D1: '=PROD(B1, C1)',
    D2: '=PROD(B2, C2)',
    D3: '=PROD(B3, C3)',
    D4: '=PROD(B4, C4)',
    C5: 'Tax (6%):',
    D5: '=PROD(0.06, SUM(D1:D4))',
    C6: 'Grand Total:',
    D6: '=SUM(D1:D5)',
}

export default function() {
    return Object.keys(cells).reduce(
        (t, n) => Table.set(t, n, cells[n]),
        Table.init()
    )
}
