import './theme.css';
import './style.css';
import './fonts.css';

import { create, feat, clear } from './html';
import { benchmarks, fetchData, results } from './data';
import { Grover } from './benchmarks/grover';
import { Menu } from './menu';
import { initTheme } from './theme';
import { PhaseEstimation } from './benchmarks/phase-estimation';
import { Summary } from './benchmarks/summary';
import { PeriodFinding } from './benchmarks/period-finding';
import { BernsteinVazirani } from './benchmarks/bernstein-vazirani';

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
                "gap": "32px",
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

async function update(content: HTMLElement, benchmark: string, backends: Set<string>) {
    if (benchmark == "summary") {
        const r = [];
        for (const benchmark of Object.keys(benchmarks())) {
            r.push(...results(benchmark, backends))
        }
        clear(content); // note: clearing after creating prevents flickering
        content.append(Summary(r));
        return;
    }

    if (benchmark == "grover") {
        const c = Grover(results(benchmark, backends));
        clear(content); // note: clearing after creating prevents flickering
        content.append(c);
        return;
    }

    if (benchmark == "phase-estimation") {
        const c = PhaseEstimation(results(benchmark, backends));
        clear(content); // note: clearing after creating prevents flickering
        content.append(c);
        return;
    }

    if (benchmark == "period-finding") {
        const c = PeriodFinding(results(benchmark, backends));
        clear(content); // note: clearing after creating prevents flickering
        content.append(c);
        return;
    }

    if (benchmark == "bernstein-vazirani") {
        const c = BernsteinVazirani(results(benchmark, backends));
        clear(content); // note: clearing after creating prevents flickering
        content.append(c);
        return;
    }
}

init();