const focus = (_, selector) =>
    requestAnimationFrame((_) => document.querySelector(selector)?.focus())

export default (selector) => [focus, selector]
