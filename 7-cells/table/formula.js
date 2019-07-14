import formulaTree from './parser.js'
export const ERROR_VALUE = Symbol()
export const EMPTY_VALUE = Symbol()

//returns an array of unique strings referencing variables
//upon which the formula depends
export function getFormulaDependencies(str) {
    function collectDeps(node, deps) {
        if (node.children) {
            node.children.forEach(ch => collectDeps(ch, deps))
        } else if (isNaN(node)) {
            deps[node] = true
        }
        return deps
    }
    const tree = formulaTree(str)
    if (!tree) return []
    const depsObj = collectDeps(tree, {})
    return Object.keys(depsObj)
}

//given an object with the names & values of variables
//upon which the formula depends, calculates the value of the formula
//variables with arrays as values are flattened in the argument lists
export function calculateFormula(str, deps) {
    function evaluate(node) {
        if (node.children) {
            //args, evaluate children. Flatten array,
            //and filter out empty values.
            const args = []
                .concat(...node.children.map(evaluate))
                .filter(x => x !== EMPTY_VALUE)
            if (args.filter(a => a === ERROR_VALUE).length) {
                return ERROR_VALUE
            }
            if (node.name.toUpperCase() === 'SUM') {
                return args.reduce((tot, x) => tot + x, 0)
            }
            if (node.name.toUpperCase() === 'PROD') {
                return args.reduce((tot, x) => tot * x, 1)
            }
            if (node.name.toUpperCase() === 'SUB') {
                if (args.length < 2 || args.length > 2) return ERROR_VALUE
                return args[0] - args[1]
            }
            if (node.name.toUpperCase() === 'DIV') {
                if (args.length < 2 || args.length > 2) return ERROR_VALUE
                if (args[1] === 0) return ERROR_VALUE
                return args[0] / args[1]
            }
            return ERROR_VALUE
        }
        if (!isNaN(node)) return +node
        if (node in deps) {
            if (typeof deps[node] === 'string') return ERROR_VALUE
            return deps[node]
        }
        return ERROR_VALUE
    }
    const tree = formulaTree(str)
    if (!tree) return ERROR_VALUE
    const val = evaluate(tree)
    if (Array.isArray(val)) return ERROR_VALUE
    return val
}
