import hx from 'https://unpkg.com/hyperlit'
import style from '../../lib/add-stylesheet.js'

const listItem = (selected, onselect) => (item, index) => hx`
	<li
		onclick=${[onselect, index]}
		class=${{ selected: selected === index }}
	>
		${item}
	</li>`

export default ({ items, selected, onselect }) => hx`
	<ul class="selectable-list">
		${items.map(listItem(selected, onselect))}
	</ul>`

style(`
.selectable-list {
	margin: 0;
	padding: 0;
	list-style-type: none;
	width: 100%;
	height: 100%;
	overflow: scroll;
	text-indent: 0;
	background-color: #fff;
	border: 1px solid #124d77;
	border-radius: 3px
}

.selectable-list > li {
	padding: 3px 2px;
	font-size: 15px;
	border-bottom: 1px #eee solid;
}

.selectable-list > li.selected {
	background-color: rgb(69, 143, 244);
}

`)
