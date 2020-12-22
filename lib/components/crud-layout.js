import html from 'https://unpkg.com/hyperlit'
import style from '../add-stylesheet.js'

export default ({ filter, list, detail, controls }) => html`
    <div class="crudlayout-container">
        <div class="crudlayout-filter">${filter}</div>
        <div class="crudlayout-list">${list}</div>
        <div class="crudlayout-detail">${detail}</div>
        <div class="crudlayout-controls">${controls}</div>
    </div>
`

style(`

.crudlayout-container {
	display: grid;
	grid-template-columns: 200px auto;
	grid-template-rows: 40px 180px 30px;
    column-gap: 10px;
    row-gap: 10px;
    grid-gap: 10px 10px;
}

.crudlayout-filter {
	grid-column: 1 / 2;
	grid-row: 1 / 2;
	text-align: right;
	overflow: hidden;
}

.crudlayout-filter input {
	width: 60px !important;
}

.crudlayout-list {
    grid-column: 1 / 2;
    grid-row: 2 / 4;
    position: relative
}

.crudlayout-detail {
	grid-column: 2 / 2;
	grid-row: 2 / 2;
}

.crudlayout-controls {
	grid-column: 2 / 3;
	grid-row: 3 / 4;
}
`)
