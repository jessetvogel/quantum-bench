import type { Result } from "../data";
import { create } from "../html";
import { color } from "../plots/colors";
import { Legend } from "../plots/legend";
import { LineChart, type Series } from "../plots/linechart";
import { TOOLTIP_ENTROPY, TOOLTIP_QPU_TIME } from "../strings";

export function PageSummary(results: Result[]): HTMLElement {
    const content = create("div");

    // Add description
    content.append(create("div",
        { style: { "margin": "0px auto" } },
        create("p", "This page shows some statistics that can be derived from the results of all benchmarks.")) // "Considering the runs from all benchmarks, some statistics can be derived."
    );

    // Collect backends
    const backends: string[] = [];
    for (const result of results) {
        if (!backends.includes(result.backend)) {
            backends.push(result.backend);
        }
    }

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
    });

    // Line chart: `QPU time` vs. `circuit depth`
    const qpu_series = createSeries("qpu_time", results);
    charts.append(LineChart(
        qpu_series, {
        xlabel: "Circuit depth",
        ylabel: "QPU time (sec)",
        // xscale: "log",
        // yscale: "log",
        ytooltip: TOOLTIP_QPU_TIME,
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
        ytooltip: TOOLTIP_ENTROPY,
        grid: true,
        width: 480,
        height: 320,
        colors,
    }));

    content.append(charts);

    const table = create("table", create("tr", create("th", "Backend"), create("th", "QPU time / circuit depth")));

    for (const [backend, points] of Object.entries(qpu_series)) {
        const { slope, offset } = linearFit(points);

        table.append(
            create("tr",
                create("td",
                    create("div",
                        { style: { "display": "flex", "gap": "6px", "align-items": "center", "font-family": "var(--font-mono)", "font-size": "0.875rem" } },
                        create("div", { style: { "background-color": colors[backend], "width": "16px", "height": "16px", "border-radius": "8px" } }),
                        backend,
                    ),
                ),
                create("td", `≈ ${offset.toFixed(2)} sec + ${(slope * 1000).toFixed(2)} sec / 1000 gates`)
            ));
    }

    content.append(table);

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

function linearFit(points: { x: number, y: number }[]): { slope: number, offset: number } {
    const n = points.length;
    if (n < 2) {
        throw new Error("Need at least 2 points");
    }

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (const { x, y } of points) {
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    }

    const slope =
        (n * sumXY - sumX * sumY) /
        (n * sumXX - sumX * sumX);

    const offset = (sumY - slope * sumX) / n;

    return { slope, offset };
}
