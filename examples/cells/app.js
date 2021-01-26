import { app } from 'https://unpkg.com/hyperapp'
import html from 'https://unpkg.com/hyperlit'
import * as Cells from '../../lib/data/cells.js'
import demoTable from './data.js'
import * as EditableTable from '../../lib/components/editable-table.js'

const initialState = {
    cells: Object.entries(demoTable).reduce(
        (data, [key, value]) => Cells.set(data, key, value),
        Cells.init()
    ),
    table: EditableTable.init(),
}

const { model: tableModel, setInput } = EditableTable.wire({
    get: (state) => state.table,

    set: (state, table) => ({ ...state, table }),

    getValue: (state, row, col) => Cells.evaluate(state.cells, col + row),

    onStartEdit: (state, { row, col }) =>
        setInput(state, Cells.get(state.cells, col + row)),

    onCompleteEdit: (state, { col, row, input }) => ({
        ...state,
        cells: Cells.set(state.cells, col + row, input),
    }),
})

export default (node) =>
    app({
        node,
        init: initialState,
        view: (state) => html`
            <div class="app app-cells">
                <${EditableTable.view} 
                    ${tableModel(state)}
                    rows=${Cells.ROWS}
                    cols=${Cells.COLS}
                />
            </div>`,
    })
