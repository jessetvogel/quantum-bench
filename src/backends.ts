import { backends, type Backend } from "./data";
import { create } from "./html";
import { Checkbox } from "./utils/checkbox";

type Options = {
    onchange?: (selected: Set<Backend>) => void,
};

export function BackendList(options: Options = {}) {
    const selected: Set<Backend> = new Set();

    const list = create("div", {
        style: {
            "display": "flex",
            "flex-direction": "column",
            "gap": "12px",
        }
    });

    list.append(create("span", "Compare backends", { style: { "font-weight": "bold" } }))

    for (const backend of backends()) {
        list.append(create("div",
            { style: { "font-family": "var(--font-mono)", "font-size": "0.875rem" } },
            Checkbox(backend.name, {
                checked: true,
                onclick: (checked) => {
                    if (checked) {
                        selected.add(backend);
                    } else {
                        selected.delete(backend);
                    }

                    options.onchange?.(selected);
                }
            })
        ));

        selected.add(backend);
    }

    setTimeout(() => options.onchange?.(selected), 10);

    return list;
}