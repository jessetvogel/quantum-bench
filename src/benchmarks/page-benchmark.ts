import type { Benchmark, Result } from "../data";
import { create } from "../html";
import { LineChart, type Series } from "../plots/linechart";
import { color } from "../plots/colors"
import { Legend } from "../plots/legend";
import { katex } from "../katex";
import { visualizations } from "./plots";
import { TOOLTIP_ENTROPY, TOOLTIP_QPU_TIME, TOOLTIP_RUN_TIME } from "../strings";

type Options = {
    animate?: boolean;
};

export function PageBenchmark(benchmark: Benchmark, results: Result[], options: Options = {}): HTMLElement {
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
        style: { "margin": "0px auto" }
    }, ...benchmark.description.split("\n\n").map(x => create("p", x)))));

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

    // Add visualizations
    for (const vis of visualizations(benchmark.id)) {
        if (vis.type == "linechart") {
            const opt: any = {
                ...vis.options,
                grid: true,
                width: 480,
                height: 320,
                colors,
                animate: options.animate || false,
            };

            if (vis.y in benchmark.metrics) opt.ytooltip = benchmark.metrics[vis.y];
            if (vis.y == "entropy") opt.ytooltip = TOOLTIP_ENTROPY;
            if (vis.y == "run_time") opt.ytooltip = TOOLTIP_RUN_TIME;
            if (vis.y == "qpu_time") opt.ytooltip = TOOLTIP_QPU_TIME;

            charts.append(LineChart(createSeries(vis.x, vis.y, results), opt));
        }
    }

    content.append(charts);

    return content;
}

function createSeries(param: string, metric: string, results: Result[]): Series {
    const series: Series = {};

    for (const result of results) {
        const name = result.backend;

        const x = result.parameters[param] as number;
        let y = result.metrics[metric] as number;

        if (x === undefined || y === undefined) continue;

        if (metric == "qpu_time" && Array.isArray(y)) {
            y = y.reduce((sum, num) => sum + num, 0.0);
        }

        if (!(name in series)) series[name] = [];

        series[name].push({ x, y });
    }

    for (const name in series) {
        series[name].sort((a, b) => a.x - b.x);
    }

    return series;
}
