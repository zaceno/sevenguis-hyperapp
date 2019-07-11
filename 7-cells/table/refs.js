const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ROWS = 100

export function valid(name) {
    return coords(name) === null ? false : true
}

export function offset(name, cols, rows) {
    let c = coords(name)
    if (!c) return null
    let {row, col} = c
    row = Math.max(0, Math.min(99, row + rows))
    col = Math.max(0, Math.min(LETTERS.length - 1, col + cols))
    return LETTERS[col] + row
}
export function rows (f) { return [...Array(ROWS).keys()].map(f) }
export function cols (f) { return LETTERS.split('').map(f) }
export function cells(row, f) { return cols(col => f(col + row)) }


function coords(name) {
    name = name.toUpperCase()
    if (!name || name.length < 2) return null
    const col = LETTERS.indexOf(name.slice(0, 1))
    if (col < 0) return null
    const row = +name.slice(1)
    if (isNaN(row) || row < 0 || row >= ROWS) return null
    return { row, col }
}

export function range(a, b) {
    let pa = coords(a)
    let pb = coords(b)
    if (!pa || !pb) return null
    let {row: aRow, col: aCol} = pa
    let {row: bRow, col: bCol} = pb
    let startRow = Math.min(aRow, bRow)
    let endRow   = Math.max(aRow, bRow)
    let startCol = Math.min(aCol, bCol)
    let endCol   = Math.max(aCol, bCol)
    let list = []
    for (let i = startCol; i <= endCol; i++) {
        for (let j = startRow; j <= endRow; j++) {
            list.push(LETTERS[i] + j)
        }
    }
    return list
}