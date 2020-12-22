import html from 'https://unpkg.com/hyperlit'
import style from '../add-stylesheet.js'

export default ({ running, percent, text }) => html`
    <div class=${['progressbar-container', { off: !running }]}>
        <div
            hidden=${!running}
            class="progressbar-progress"
            style=${{ width: percent + '%' }}
        />
        <div hidden=${!running} class="progressbar-text">${text}</div>
    </div>
`

style(
    `
.progressbar-container {
	display: inline-block;
	border-radius: 3px;
	border: 1px solid #124d77;
	font-size: 15px;
	padding: 6px 12px;
	position: relative;
	height: 15px;
	width: 200px;
}
.progressbar-container.off {
	border-color: #ddd;
	color: #ddd;
	background-color: #eee;
}
.progressbar-container .progressbar-progress {
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	width: 0;
	background-color: rgb(69, 143, 244);
}

.progressbar-container .progressbar-text{
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	text-align: center;
	color: #000;
	font-size: 15px;
	line-height: 28px;
}

`
)
