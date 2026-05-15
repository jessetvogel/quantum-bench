import { create } from "../html";

type Colors = {
    [key: string]: string,
};

export function Legend(colors: Colors): HTMLElement {
    const legend = create("div", {
        style: {
            "display": "flex",
            "flex-direction": "row",
            "flex-wrap": "wrap",
            "gap": "16px",
            "justify-content": "center",
            "font-family": "var(--font-mono)",
            "font-size": "0.875rem",
            "padding": "16px",
            "border": "1px solid var(--border)",
            "margin": "0px 16px 16px 16px",
        }
    });

    for (const key in colors) {
        legend.append(create("div",
            { style: { "display": "flex", "gap": "6px", "align-items": "center" } },
            create("div", {
                style: {
                    "background-color": colors[key],
                    "width": "16px",
                    "height": "16px",
                    "border-radius": "8px",
                }
            }),
            create("span", key),
        ))
    }

    return legend;
}