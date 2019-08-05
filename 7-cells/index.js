import { h, app } from 'https://unpkg.com/hyperapp'
import { eventOptions, targetValue } from 'https://unpkg.com/@hyperapp/events'
import * as Table from './table/index.js'
import demoTable from './demo-table.js'
import Focus from '../lib/fx/focus.js'

const edit = (state, cell) => ({
    ...state,
    editing: cell,
    entry: Table.get(state.table, cell),
    table: state.editing
        ? Table.set(state.table, state.editing, state.entry)
        : state.table,
})

const ClickCell = (state, cell) => [edit(state, cell), Focus('cellinput')]

const Enter = (state, entry) => ({ ...state, entry })

const HandleKey = (state, event) => {
    const offs =
        event.key === 'Enter' && !event.shiftKey
            ? [0, 1]
            : event.key === 'Enter' && event.shiftKey
            ? [0, -1]
            : event.key === 'Tab' && !event.shiftKey
            ? [1, 0]
            : event.key === 'Tab' && event.shiftKey
            ? [-1, 0]
            : [0, 0]
    const editing = Table.offset(state.editing, ...offs)
    return editing === state.editing
        ? state
        : [
              edit(state, editing),
              eventOptions({ event, preventDefault: true }),
              Focus('cellinput'),
          ]
}

const CellInput = state =>
    h('input', {
        id: 'cellinput',
        type: 'text',
        value: state.entry,
        oninput: [Enter, targetValue],
        onkeydown: HandleKey,
    })

const CellContent = (state, name) =>
    h('span', {}, [Table.evaluate(state.table, name)])

const TableCell = (state, name) =>
    h('td', { onclick: [ClickCell, name] }, [
        state.editing === name ? CellInput(state) : CellContent(state, name),
    ])

const TableView = state =>
    h('table', {}, [
        h('tr', {}, [
            h('th', {}, []),
            ...Table.cols(col => h('th', {}, [col])),
        ]),
        ...Table.rows(row =>
            h('tr', {}, [
                h('th', {}, [row]),
                ...Table.cells(row, cell => TableCell(state, cell)),
            ])
        ),
    ])

app({
    node: document.getElementById('app-cells'),
    init: { table: Table.init(demoTable), editing: null, entry: null },
    view: state =>
        h('div', {}, [
            h('div', { class: 'scrollcontainer' }, [TableView(state)]),
        ]),
})
