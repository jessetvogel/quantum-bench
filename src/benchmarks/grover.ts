// Code that creates the visualizations for Grover's algorithm specifically

import type { Backend, Run } from "../data";
import { create } from "../html";
import { LineChart, type Series } from "../plots/linechart";
import { color } from "../plots/colors"
import { Legend } from "../plots/legend";

export function Grover(content: HTMLElement, runs: Run[]) {
    // Collect backends
    const backends: Backend[] = [];
    for (const run of runs) {
        if (!backends.includes(run.backend)) {
            backends.push(run.backend);
        }
    }

    // Create legend
    const colors = Object.fromEntries(backends.map((backend, i) => [backend.name, color(i)]));
    const legend = Legend(colors);
    content.append(create("div", legend, { style: { "display": "flex", "justify-content": "center"} }));

    const charts = create("div", {
        style: {
            "display": "flex",
            "gap": "16px",
            "flex-wrap": "wrap",
            "justify-content": "center",
            "align-items": "center",
        }
    })

    // Line chart: `runtime` vs. `n`
    {
        const linechart = LineChart(
            createSeries("n", "runtime", runs), {
            yscale: "log",
            xlabel: "n",
            ylabel: "Runtime (sec)",
            grid: true,
            // legend: true,
            width: 480,
            height: 320,
            colors,
        });

        charts.append(linechart);
    }

    // Line chart: `qpu_time` vs. `n`
    {
        const linechart = LineChart(
            createSeries("n", "qpu_time", runs), {
            yscale: "log",
            xlabel: "n",
            ylabel: "QPU time (sec)",
            grid: true,
            // legend: true,
            width: 480,
            height: 320,
            colors,
        });


        charts.append(linechart);
    }

    // Line chart: `accuracy` vs. `n`
    {
        const linechart = LineChart(
            createSeries("n", "accuracy", runs), {
            xlabel: "n",
            ylabel: "Accuracy",
            grid: true,
            // legend: true,
            width: 480,
            height: 320,
            colors,
        });

        charts.append(linechart);
    }

    content.append(charts);
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
