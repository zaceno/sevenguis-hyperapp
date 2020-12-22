import 'https://unpkg.com/construct-style-sheets-polyfill'

const scopeCss = (css, scope) =>
    css
        .split('}')
        .map(directive => {
            if (directive.indexOf('{') < 0) return directive
            const [selectors, rules] = directive.split('{')
            return `${selectors
                .split(',')
                .map(selector => `${scope} ${selector}`)
                .join(',')} { ${rules}`
        })
        .join('}')

export default (css, scope) => {
    const ss = new CSSStyleSheet()
    if (scope) css = scopeCss(css, scope)
    ss.replaceSync(css)
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, ss]
}
