const END     = Symbol()
const INITIAL = Symbol()
const NAMING  = Symbol()
const OPENED  = Symbol()
const CLOSED  = Symbol()
const ERROR   = Symbol()

function pushName(mem) {
    if (!mem.container.children) throw ERROR
    mem.container.children.push(mem.buffer.join(''))
    return { ...mem, buffer: [] }
}

function inpArgSep(mem) {
    if (mem.state === INITIAL) throw ERROR
    if (mem.state === OPENED) throw ERROR
    if (!mem.container) throw ERROR
    if (mem.state === NAMING) mem = pushName(mem)
    return { ...mem, state: INITIAL }
}

function inpListOpen(mem) {
    if (mem.state !== NAMING) throw ERROR
    const node = {
        name: mem.buffer.join(''),
        children: [],
        parent: mem.container,
    }
    if (mem.container) mem.container.children.push(node)
    return {
        ...mem,
        root: mem.root || node,
        buffer: [],
        state: OPENED,
        container: node,
    }
}

function inpListClose(mem) {
    if (mem.state === INITIAL) throw ERROR
    if (!mem.container) throw ERROR
    if (mem.state === NAMING) mem = pushName(mem)
    return { ...mem, container: mem.container.parent, state: CLOSED }
}

function inpEnd(mem) {
    function clean(node) {
        //removes all 'parent' references from subtree
        if (!node.children) return node
        return {
            name: node.name,
            children: node.children.map(clean),
        }
    }
    if (mem.state === INITIAL) throw ERROR
    if (mem.state === OPENED) throw ERROR
    if (mem.container) throw ERROR
    if (!mem.root) {
        if (mem.buffer.length) {
            mem.root = mem.buffer.join('')
            mem.buffer = []
        } else throw ERROR
    }
    if (mem.buffer.length) throw ERROR
    return clean(mem.root)
}

function inpChar(mem, char) {
    if (mem.state === CLOSED) throw ERROR
    return { ...mem, state: NAMING, buffer: [...mem.buffer, char] }
}

export default function(input) {
    try {
        return input
            .split('')
            .concat(END)
            .reduce((mem, char) => {
                if (char === ' ') return mem
                if (char === ',') return inpArgSep(mem)
                if (char === '(') return inpListOpen(mem)
                if (char === ')') return inpListClose(mem)
                if (char === END) return inpEnd(mem)
                return inpChar(mem, char)
            }, {
                root: null,
                state: INITIAL,
                container: null,
                buffer: [],
            })
    } catch (e) {
        if (e === ERROR) return null
        throw e
    }
}
