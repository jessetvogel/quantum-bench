import './theme.css';
import './style.css';
import './fonts.css';

import { create, feat, clear } from './html';
import { benchmarks, loadRuns, type Backend, type Benchmark, type Run } from './data';
import { Grover } from './benchmarks/grover';
import { Menu } from './menu';
import { initTheme } from './theme';
import { PhaseEstimation } from './benchmarks/phase-estimation';
import { Summary } from './benchmarks/summary';

initTheme();

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

async function update(content: HTMLElement, benchmark: Benchmark | "summary", backends: Set<Backend>) {
    if (benchmark == "summary") {
        const runs: Run[] = [];
        for (const benchmark of benchmarks()) {
            runs.push(...await loadRuns(benchmark, backends))
        }
        clear(content); // note: clearing after creating prevents flickering
        content.append(Summary(runs));
        return;
    }

    if (benchmark.name == "Grover") {
        const runs = await loadRuns(benchmark, backends);
        const c = Grover(runs);
        clear(content); // note: clearing after creating prevents flickering
        content.append(c);
        return;
    }

    if (benchmark.name == "Phase estimation") {
        const runs = await loadRuns(benchmark, backends);
        const c = PhaseEstimation(runs);
        clear(content); // note: clearing after creating prevents flickering
        content.append(c);
        return;
    }
}
