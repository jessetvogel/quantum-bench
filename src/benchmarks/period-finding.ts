// Code that creates the visualizations for Grover's algorithm specifically

import type { Result } from "../data";
import { create } from "../html";
import { LineChart, type Series } from "../plots/linechart";
import { color } from "../plots/colors"
import { Legend } from "../plots/legend";
import { katex } from "../katex";

const PERIOD_FINDING_DESCRIPTION = `
Write description about period finding.
`;

export function PeriodFinding(results: Result[]): HTMLElement {
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
    }, ...PERIOD_FINDING_DESCRIPTION.split("\n\n").map(x => create("p", x)))));

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

    // Line chart: `run_time` vs. `n`
    charts.append(LineChart(
        createSeries("n", "run_time", results), {
        yscale: "log",
        xlabel: "n",
        ylabel: "Run time (sec)",
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
