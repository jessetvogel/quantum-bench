import { BackendList } from "./backends";
import { BenchmarkList } from "./benchmarks";
import type { Backend, Benchmark } from "./data";
import { create, feat } from "./html";

type Options = {
    onchange?: (benchmark: Benchmark, backends: Set<Backend>) => void,
};

export function Menu(options: Options = {}): HTMLElement {
    const menu = create("div", {
        style: {
            "display": "flex",
            "flex-direction": "column",
            "gap": "32px",
            "padding": "16px",
            "border": "1px solid var(--border)",
        }
    });

    const ctx: { benchmark: Benchmark | null, backends: Set<Backend> } = { benchmark: null, backends: new Set() };

    menu.append(feat(BenchmarkList({
        onchange: (benchmark) => {
            ctx.benchmark = benchmark;
            options.onchange?.(ctx.benchmark, ctx.backends);
        },
    })));

    menu.append(feat(BackendList({
        onchange: (backends) => {
            ctx.backends = backends;
            if (ctx.benchmark !== null) {
                options.onchange?.(ctx.benchmark, ctx.backends);
            }
        },
    })));

    return menu;
}