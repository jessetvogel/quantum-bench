import './theme.css';
import './style.css';

import { create, feat, clear } from './html';
import { benchmarks, fetchData, results } from './data';
import { Menu } from './menu';
import { initTheme } from './theme';
import { PageSummary } from './benchmarks/page-summary';
import { PageBenchmark } from './benchmarks/page-benchmark';

async function init() {
    // Initialize theme
    initTheme();

    // Fetch data
    await fetchData();

    // Create app
    const app = document.querySelector<HTMLDivElement>("#app")!;

    const content = create("div", {
        style: {
            "grid-row": "1 / 2",
            "grid-column": "2 / 3",
            "margin-bottom": "32px",
            "padding": "0px 32px",
        }
    });

    app.append(create("div", "Quantum Bench", { id: "title" }));

    app.append(create("div",
        {
            id: "grid",
            class: "debug-grid",
            style: {
                "display": "grid",
                "grid-template-columns": "224px auto",
                "grid-template-rows": "auto",
                "max-width": "1280px",
                "margin": "0px auto",
            }
        },
        feat(Menu({ onchange: (benchmark, backends) => update(content, benchmark, backends) }), {
            style: { "grid-row": "1 / 2", "grid-column": "1 / 2", "align-self": "start" }
        }),
        content
    ));
}

let previousBenchmark: string = "";

async function update(content: HTMLElement, benchmark: string, backends: Set<string>) {
    if (benchmark == "summary") {
        const r = [];
        for (const benchmark of Object.keys(benchmarks())) {
            r.push(...results(benchmark, backends))
        }
        clear(content); // note: clearing after creating prevents flickering
        content.append(PageSummary(r));
        return;
    }

    const b = benchmarks()[benchmark];
    const r = results(benchmark, backends);

    const c = PageBenchmark(b, r, { animate: benchmark != previousBenchmark });
    clear(content); // note: clearing after creating prevents flickering
    content.append(c);

    previousBenchmark = benchmark;
}

init();