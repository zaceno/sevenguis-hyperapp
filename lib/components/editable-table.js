import style from '../add-stylesheet.js'
import html from 'https://unpkg.com/hyperlit'
import focus from '../io/focus.js'

const init = () => ({
    editingRow: null,
    editingCol: null,
    input: null,
})

const wire = ({ get, set, onStartEdit, onCompleteEdit, getValue }) => {
    const finishEditing = (state) => {
        let slice = get(state)
        if (slice.editingRow === null) return state
        state = onCompleteEdit(state, {
            row: slice.editingRow,
            col: slice.editingCol,
            input: slice.input,
        })
        state = set(state, {
            ...slice,
            editingRow: null,
            editingCol: null,
        })
        return state
    }

    const InputKeyPress = (state, event) =>
        event.key === 'Enter' ? finishEditing(state) : state

    const setInput = (state, input) => set(state, { ...get(state), input })

    const SetInput = (state, ev) => setInput(state, ev.target.value)

    const Edit = (state, { row, col }) => {
        state = finishEditing(state)
        state = set(state, { ...get(state), editingRow: row, editingCol: col })
        state = onStartEdit(state, { row, col })
        return [state, focus('table.editable-table input')]
    }

    const model = (state) => ({
        ...get(state),
        getCellValue: (row, col) => getValue(state, row, col),
        InputKeyPress,
        SetInput,
        Edit,
    })

    return {
        model,
        setInput,
    }
}

const view = ({ cols, rows, ...model }) => html`
    <div class="editable-table-container">
        <table class="editable-table">
            <tr>
                <th></th>
                ${cols.map((col) => html`<th>${col}</th>`)}
            </tr>
            ${rows.map(
                (row) => html`
            <tr>
                <th>${row}</th>
                ${cols.map(
                    (col) => html`
                <td onclick=${[model.Edit, { row, col }]}>
                    ${
                        model.editingRow == row && model.editingCol == col
                            ? html`
                        <input
                            type="text"
                            value=${model.input}
                            onkeypress=${model.InputKeyPress}
                            oninput=${model.SetInput}
                        />`
                            : model.getCellValue(row, col)
                    }
                </td>
                `
                )}
            </tr>
            `
            )}
        </table>
    </div>`

export { init, wire, view }

style(
    `
{
    width: 100%;
    height: 350px;
    overflow: scroll;
    background-color: #fff;
}
table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 2160px;
}
th,
td {
    font-family: monospace;
    font-size: 14px;
    text-align: right;
    width: 120px;
    height: 20px;
    border: 1px #ccc solid;
    overflow: hidden;
    padding: 0;
    padding-right: 4px;
}
th {
    font-weight: bold;
    text-align: center;
    background-color: #eee;
    color: #999;
    text-transform: uppercase;
}
th.column {
    text-transform: uppercase;
}
th:first-child {
    width: 20px;
}
td input {
    margin: 0;
    margin-right: -4px;
    padding: 0;
    border: 0;
    width: 120px;
    height: 20px;
    box-sizing: border-box;
    font-size: 14px;
    padding-left: 4px;
    background-color: rgb(179, 229, 255);
}

`,
    '.editable-table-container'
)
