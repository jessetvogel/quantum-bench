export function create(tag: string, ...content: ({ [key: string]: any } | string | HTMLElement)[]): HTMLElement {
    return feat(document.createElement(tag), ...content);
}

export function feat(elem: HTMLElement, ...content: ({ [key: string]: any } | string | HTMLElement)[]): HTMLElement {
    for (let i = 0; i < content.length; ++i) {
        const item = content[i];

        if (typeof item === 'string') { elem.innerHTML = item; }
        else if (item instanceof HTMLElement || item instanceof SVGElement) { elem.append(item); }
        else {
            for (const key in item) {
                if (key === "style" && typeof item[key] === "object") {
                    for (const [cssProp, cssValue] of Object.entries(item[key])) {
                        elem.style.setProperty(cssProp, cssValue as string);
                    }
                    continue;
                }

                if (key.startsWith('@')) {
                    elem.addEventListener(key.substring(1), item[key]);
                    continue;
                }

                elem.setAttribute(key, item[key]);
            }
        }
    }

    return elem;
}

export function clear(elem: HTMLElement) {
    elem.innerHTML = "";
}