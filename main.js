import { app } from 'https://unpkg.com/hyperapp'
import html from 'https://unpkg.com/hyperlit'
import { request as http } from 'https://unpkg.com/@hyperapp/http'
import * as router from './lib/io/router.js'
import makeRunnerInstance from './lib/io/runner.js'
import higlighter from './lib/io/syntax-higlighter.js'

const examples = {
    '#counter': 'Counter',
    '#temperature': 'Temperature',
    '#flight': 'Flights',
    '#timer': 'Timer',
    '#crud': 'CRUD',
    '#circles': 'Circles',
    '#cells': 'Cells',
}

const initialState = {
    info: null,
    code: null,
    route: null,
    path: null,
    loading: null,
}

const maybeDoneLoading = (state) => {
    if (state.nextCode && state.nextInfo && state.nextRunning) {
        return [
            {
                ...state,
                loading: null,
                code: state.nextCode,
                info: state.nextInfo,
            },
            higlighter(),
        ]
    }
    return state
}

const AppWillStart = (state) => ({ ...state, path: state.loading })

const AppStarted = (state) => maybeDoneLoading({ ...state, nextRunning: true })

const runner = makeRunnerInstance({
    selector: 'body > main > main > *:first-child',
    onWillStart: AppWillStart,
    onStarted: AppStarted,
})

const SetRoute = (state, route) => {
    state = { ...state, route }
    if (!examples[route])
        return [{ ...state, path: null, info: null, code: null }, runner(null)]
    let path = './examples/' + route.replace('#', '') + '/'
    return [
        {
            ...state,
            nextRunning: false,
            nextInfo: null,
            nextCode: null,
            loading: path,
        },
        runner(path + 'app.js'),
        http({ url: path + 'info.html', expect: 'text', action: GotInfo }),
        http({ url: path + 'app.js', expect: 'text', action: GotCode }),
    ]
}

const GotInfo = (state, info) => maybeDoneLoading({ ...state, nextInfo: info })

const GotCode = (state, code) => maybeDoneLoading({ ...state, nextCode: code })

const navLink = ({ current, route, ...props }, content) =>
    html`
        <a ${props} href=${route} class=${{ current: current === route }}>
            ${content}
        </a>
    `
const navLogo = ({ current }) => html`
    <${navLink} route="#" id="logo">
        <h1>
            <span>Seven GUIs</span>
            <br />
            <span>with Hyperapp</span>
        </h1>
    <//>
`

const navGithubLink = () => html`
    <a id="githublink" href="https://github.com/zaceno/sevenguis-hyperapp">
        <img alt="GitHub repository" src="./GitHub-Mark-Light-32px.png" />
    </a>
`

const navExamplesItem = (props) => html`
    <li>
        <${navLink} ${props}>${examples[props.route]}<//>
    </li>
`

const navExamples = ({ current }) => html`
    <ul>
        ${Object.keys(examples).map((route) =>
            navExamplesItem({ route, current })
        )}
    </ul>
`

const navigation = (state) => [
    navLogo({ current: state.route }),
    navExamples({ current: state.route }),
    navGithubLink(),
]

const mainInfo = () => html`
    <h1 id="mainTitle">
        <span>Seven GUIs</span>
        <br />
        <span>with Hyperapp</span>
    </h1>

    <p>
        <a href="https://eugenkiss.github.io/7guis/">7GUIs</a> 
        is a series of seven gui-applications, each posing unique challenges to 
        front-end/GUI development. The goal of their project is to catalog 
        implementations of the seven tasks in a large variety of frameworks, in 
        order to showcase how those challenges can be solved with that  
        particular framework. 
    </p>

    <p>
        This is an implementation of the seven tasks using 
        <a href="https://github.com/jorgebucaran/hyperapp">Hyperapp</a> 
        – a javascript front-end micro-framework featuring a fast vdom 
        implementation, built in state management and declarative subscriptions. 
        Inspired by Elm, it is heavily slanted toward the functional and 
        declarative paradigm. 
    </p>

    <p>
        For each of the examples I present the code along with the running demo. 
        Code that isn't relevant to explaining the example has been broken out 
        in a separate import. Where I can, I have used third-party libraries,  
        but most of the imports are my own. If their implementation interests  
        you, find them by checking out the 
        <code>lib/</code> 
        folder in the 
        <a href="https://github.com/zaceno/sevenguis-hyperapp"> 
            Github repository  
        </a> 
        for this project. 
    </p>

    <p>
        I have taken the libery of using 
        <a href="https://github.com/zaceno/hyperlit">hyperlit</a> 
        to define the views, rather than Hyperapp's built in 
        <code>h()</code> 
        and 
        <code>text()</code> 
        , or 
        <a href="https://github.com/jorgebucaran/hyperapp/tree/main/pkg/html"> 
            <code>@hyperapp/html</code> 
        </a> 
        simply because I feel it makes examples more readable when the views 
        resemble the html they are meant to produce. 
    </p> 

    <p>
        And I suppose it goes without saying: this site was itself implemented 
        using Hyperapp 
    </p>
`

const exampleRunView = (state) =>
    state.path
        ? html`
              <div key=${state.path} />
          `
        : mainInfo()

const exampleInfo = (state) => state.info && html([state.info])

const exampleCode = (state) =>
    state.code &&
    html`
        <pre key=${state.path} class="language-javascript">
            <code>
                ${state.code}
            </code>
        </pre>
    `

const loadingSpinner = (state) =>
    state.loading &&
    html`
        <div id="spinner-backdrop">
            <div id="spinner" />
        </div>
    `

const appView = (state) => html`
    <body>
        <nav>
            <${navigation} ${state} />
        </nav>
        <main>
            <main>
                <${exampleRunView} ${state} />
            </main>
            <section id="info">
                <${exampleInfo} ${state} />
            </section>
            <${loadingSpinner} ${state} />
        </main>
        <section id="code">
            <${exampleCode} ${state} />
        </section>
    </body>
`

app({
    init: [initialState, router.current(SetRoute)],
    subscriptions: () => [router.listen(SetRoute)],
    view: appView,
    node: document.body,
})
