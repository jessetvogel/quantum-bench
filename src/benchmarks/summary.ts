import type { Result } from "../data";
import { create } from "../html";
import { color } from "../plots/colors";
import { Legend } from "../plots/legend";
import { LineChart, type Series } from "../plots/linechart";

export function Summary(results: Result[]): HTMLElement {
    const content = create("div");

    // Add description
    content.append(create("div",
        { style: { "margin": "0px auto" } },
        create("p", "Considering the runs from all benchmarks, some statistics can be derived."))
    );

    // Collect backends
    const backends: string[] = [];
    for (const result of results) {
        if (!backends.includes(result.backend)) {
            backends.push(result.backend);
        }
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
    });

    // Line chart: `QPU time` vs. `circuit depth`
    charts.append(LineChart(
        createSeries("qpu_time", results), {
        xlabel: "Circuit depth",
        ylabel: "QPU time (sec)",
        // xscale: "log",
        // yscale: "log",
        grid: true,
        width: 480,
        height: 320,
        colors,
    }));

    // Line chart: `entropy` vs. `circuit depth`
    charts.append(LineChart(
        createSeries("entropy", results), {
        xlabel: "Circuit depth",
        ylabel: "Entropy",
        grid: true,
        width: 480,
        height: 320,
        colors,
    }));

    content.append(charts);

    return content;
}

function createSeries(metric: string, results: Result[]): Series {
    const series: Series = {};

    for (const result of results) {
        const name = result.backend;

        const x = result.metrics["circuit_depth"] as number;
        const y = result.metrics[metric] as number;

        if (x === undefined || y === undefined) continue;

        if (!(name in series)) series[name] = [];

        if (Array.isArray(x) && Array.isArray(y)) {
            for (let i = 0; i < x.length; ++i) {
                series[name].push({ x: x[i], y: y[i] });
            }
            continue;
        }

        if (Array.isArray(x) && !Array.isArray(y)) {
            for (let i = 0; i < x.length; ++i) {
                series[name].push({ x: x[i], y });
            }
            continue;
        }

        series[name].push({ x, y });
    }

    for (const name in series) {
        series[name].sort((a, b) => a.x - b.x);
    }

    console.log(series);

    return series;
}
