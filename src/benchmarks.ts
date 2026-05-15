import { benchmarks, type Benchmark } from "./data";
import { create } from "./html";

type Options = {
    onchange?: (selected: Benchmark) => void,
};

export function BenchmarkList(options: Options = {}) {
    const list = create("div",
        {
            style: {
                "display": "flex",
                "flex-direction": "column",
                "gap": "8px",
            }
        },
        create("span", "Select benchmark", { style: { "font-weight": "bold" } })
    );

    const benchs = Object.fromEntries(benchmarks().map(b => [b.name, b]));

    const select = create("select", {
        "@change": () => options.onchange?.(benchs[select.value])
    }) as HTMLSelectElement;

    select.append(create("option", "-", { disabled: true, selected: true }))
    for (const name in benchs) {
        select.append(create("option", name, { value: name }));
    }

    list.append(select);

    return list;
}
