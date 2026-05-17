// Code that creates the visualizations for Grover's algorithm specifically

import type { Result } from "../data";
import { create } from "../html";
import { LineChart, type Series } from "../plots/linechart";
import { color } from "../plots/colors"
import { Legend } from "../plots/legend";
import { katex } from "../katex";

const GROVER_DESCRIPTION = `
For each integer $n \\ge 2$, a secret bitstring $s \\in \\{0,1\\}^n$ is chosen, from which an $n$-qubit oracle $\\mathcal{O}$ is constructed defined by
$\\mathcal{O}\\ket{s} = -\\ket{s}$ and $\\mathcal{O}\\ket{i} = \\ket{i}$ for all $i \\ne s$.

This benchmark executes Grover's search algorithm for 1,000 shots and measures how often the correct secret string is returned.

The reported accuracy is the fraction of shots that produce the secret $s$. Note that, even an ideal quantum computer will generally not achieve an accuracy of exactly $1$, since Grover's algorithm is probabilistic. However, the theoretical success probability is always very close to $1$.
`;

export function Grover(results: Result[]): HTMLElement {
    const content = create("div");

    // Collect backends
    const backends: string[] = [];
    for (const result of results) {
        if (!backends.includes(result.backend)) {
            backends.push(result.backend);
        }
    }

    // Add description
    content.append(katex(create("div", {
        style: { "max-width": "50em", "margin": "0px auto" }
    }, ...GROVER_DESCRIPTION.split("\n\n").map(x => create("p", x)))));

    // Case no data
    if (backends.length == 0) {
        content.append(create("div",
            "No backends selected. Use the menu on the left to select some backends to compare.",
            { style: { "text-align": "center", "padding": "16px 16px", "color": "var(--muted)", "font-style": "italic" } },
        ));
        return content;
    }

    // Create legend
    const colors = Object.fromEntries(backends.map((backend, i) => [backend, color(i)]));
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

    // Line chart: `accuracy` vs. `n`
    charts.append(LineChart(
        createSeries("n", "accuracy", results), {
        xlabel: "n",
        ylabel: "Accuracy",
        grid: true,
        width: 480,
        height: 320,
        colors,
    }));

    // Line chart: `entropy` vs. `n`
    charts.append(LineChart(
        createSeries("n", "entropy", results), {
        xlabel: "n",
        ylabel: "Entropy",
        grid: true,
        width: 480,
        height: 320,
        colors,
    }));

    // Line chart: `runtime` vs. `n`
    charts.append(LineChart(
        createSeries("n", "runtime", results), {
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
        createSeries("n", "qpu_time", results), {
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

function createSeries(param: string, metric: string, results: Result[]): Series {
    const series: Series = {};

    for (const result of results) {
        const name = result.backend;

        const x = result.parameters[param] as number;
        const y = result.metrics[metric] as number;

        if (x === undefined || y === undefined) continue;

        if (!(name in series)) series[name] = [];

        series[name].push({ x, y });
    }

    for (const name in series) {
        series[name].sort((a, b) => a.x - b.x);
    }

    return series;
}
