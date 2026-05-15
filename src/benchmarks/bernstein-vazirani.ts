// Code that creates the visualizations for Grover's algorithm specifically

import type { Backend, Run } from "../data";
import { create } from "../html";
import { LineChart, type Series } from "../plots/linechart";
import { color } from "../plots/colors"
import { Legend } from "../plots/legend";
import { katex } from "../katex";

const BERNSTEIN_VAZIRANI_DESCRIPTION = `
Write description about Bernstein-Vazirani.
`;

export function BernsteinVazirani(runs: Run[]): HTMLElement {
    const content = create("div");

    console.log(runs);

    // Collect backends
    const backends: Backend[] = [];
    for (const run of runs) {
        if (!backends.includes(run.backend)) {
            backends.push(run.backend);
        }
    }

    // Add description
    content.append(katex(create("div", {
        style: { "max-width": "50em", "margin": "0px auto" }
    }, ...BERNSTEIN_VAZIRANI_DESCRIPTION.split("\n\n").map(x => create("p", x)))));

    // Case no data
    if (backends.length == 0) {
        content.append(create("div",
            "No backends selected. Use the menu on the left to select some backends to compare.",
            { style: { "text-align": "center", "padding": "16px 16px", "color": "var(--muted)", "font-style": "italic" } },
        ));
        return content;
    }

    // Create legend
    const colors = Object.fromEntries(backends.map((backend, i) => [backend.name, color(i)]));
    const legend = Legend(colors);
    content.append(create("div", legend, { style: { "display": "flex", "justify-content": "center" } }));

    const charts = create("div", {
        style: {
            "display": "flex",
            "gap": "16px",
            "flex-wrap": "wrap",
            "justify-content": "center",
            "align-items": "center",
        }
    })

    // Line chart: `fidelity` vs. `n`
    charts.append(LineChart(
        createSeries("n", "fidelity", runs), {
        xlabel: "n",
        ylabel: "Fidelity",
        grid: true,
        width: 480,
        height: 320,
        colors,
    }));

    // Line chart: `entropy` vs. `n`
    charts.append(LineChart(
        createSeries("n", "entropy", runs), {
        xlabel: "n",
        ylabel: "Entropy",
        grid: true,
        width: 480,
        height: 320,
        colors,
    }));

    // Line chart: `runtime` vs. `n`
    charts.append(LineChart(
        createSeries("n", "runtime", runs), {
        yscale: "log",
        xlabel: "n",
        ylabel: "Runtime (sec)",
        grid: true,
        width: 480,
        height: 320,
        colors,
    }));

    // Line chart: `qpu_time` vs. `n`
    charts.append(LineChart(
        createSeries("n", "qpu_time", runs), {
        yscale: "log",
        xlabel: "n",
        ylabel: "QPU time (sec)",
        grid: true,
        width: 480,
        height: 320,
        colors,
    }));

    content.append(charts);

    return content;
}

function createSeries(param: string, metric: string, runs: Run[]): Series {
    const series: Series = {};

    for (const run of runs) {
        const name = run.backend.name;

        const x = run.parameters[param] as number;
        const y = run.metrics[metric] as number;

        if (x === undefined || y === undefined) continue;

        if (!(name in series)) series[name] = [];

        series[name].push({ x, y });
    }

    for (const name in series) {
        series[name].sort((a, b) => a.x - b.x);
    }

    return series;
}
