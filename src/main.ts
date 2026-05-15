import './theme.css';
import './style.css';
import './fonts.css';

import { create, feat, clear } from './html';
import { loadRuns, type Backend, type Benchmark } from './data';
import { Grover } from './benchmarks/grover';
import { Menu } from './menu';


const app = document.querySelector<HTMLDivElement>("#app")!;

const content = create("div", {
    style: {
        "grid-row": "1 / 2",
        "grid-column": "2 / 3"
    }
});

app.append(create("div", "Quantum Bench", { id: "title" }));

app.append(create("div",
    {
        id: "grid",
        class: "debug-grid",
        style: {
            "display": "grid",
            "grid-template-columns": "192px auto",
            "grid-template-rows": "64px auto",
            "max-width": "1280px",
            "margin": "0px auto",
        }
    },
    feat(Menu({ onchange: (benchmark, backends) => update(content, benchmark, backends), }), {
        style: { "grid-row": "1 / 2", "grid-column": "1 / 2", "align-self": "start" }
    }),
    content
));

async function update(content: HTMLElement, benchmark: Benchmark, backends: Set<Backend>) {
    clear(content);

    if (benchmark.name == "Grover") {
        const runs = await loadRuns(benchmark, backends);
        Grover(content, runs);
    }
}
