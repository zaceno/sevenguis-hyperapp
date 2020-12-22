const recalculate = (store, down) => {
    store = store[down].upstream.reduce(
        (store, up) => ({
            ...store,
            [up]: {
                ...store[up],
                downstream: store[up].downstream.filter((v) => v != down),
            },
        }),
        { ...store, [down]: { ...store[down], upstream: [] } }
    )

    if (store[down].fn) {
        let v = store[down].fn((up) => {
            store = {
                ...store,
                [up]: {
                    ...store[up],
                    upstream: store[up] ? store[up].upstream : [],
                    downstream: [
                        ...(store[up] ? store[up].downstream : []),
                        down,
                    ],
                },
                [down]: {
                    ...store[down],
                    upstream: [...store[down].upstream, up],
                },
            }
            return store[up].value
        })
        store = { ...store, [down]: { ...store[down], value: v } }
    }

    return store[down].downstream.reduce(recalculate, store)
}

const set = (store, key, value) =>
    recalculate(
        {
            ...store,
            [key]: {
                upstream: store[key] ? store[key].upstream : [],
                downstream: store[key] ? store[key].downstream : [],
                value: typeof value !== 'function' ? value : undefined,
                fn: typeof value === 'function' ? value : undefined,
            },
        },
        key
    )

const get = (store, key) => (store[key] ? store[key].value : undefined)
const init = () => ({})
export { get, set, init }
