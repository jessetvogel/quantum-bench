import { benchmarks } from "./data";
import { create } from "./html";

type Options = {
    onchange?: (selected: string) => void,
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

    const benchs = benchmarks();
    const select = create("select", {
        "@change": () => {
            if (select.value in benchs)
                options.onchange?.(select.value)
            else // FIXME
                options.onchange?.("summary" as any)
        }
    }) as HTMLSelectElement;

    select.append(
        create("option", "-", { disabled: true, selected: true }, { style: { "display": "none", "visibility": "hidden" } }),
        ...Object.keys(benchs).map(name => create("option", name, { value: name })),
        create("option", "────────────────", { disabled: true, style: "line-height: 1px;" }),
        create("option", "Summary")
    );

    list.append(select);

    return list;
}
