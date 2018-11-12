export function loop(items, templateFn) {
    return items.reduce((html, item, index) => {
        return html += templateFn(item, index);
    }, '')
}

export function renderError(errors, name) {
    if (errors && errors[name]) {
        return `
            <span style="color: red">${errors[name]}</span>
        `
    }

    return ''
}

