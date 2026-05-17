type LineChart = {
    type: "linechart",
    x: string,
    y: string,
    options: { [option: string]: any }
};

type Visualization = LineChart;

export function visualizations(benchmark: string): Visualization[] {
    if (benchmark == "grover") {
        return [
            { type: "linechart", x: "n", y: "accuracy", options: { xlabel: "n", ylabel: "Accuracy" } },
            { type: "linechart", x: "n", y: "entropy", options: { xlabel: "n", ylabel: "Entropy" } },
            { type: "linechart", x: "n", y: "run_time", options: { xlabel: "n", ylabel: "Run time (sec)", yscale: "log" } },
            { type: "linechart", x: "n", y: "qpu_time", options: { xlabel: "n", ylabel: "QPU time (sec)", yscale: "log" } },
        ]
    }

    if (benchmark == "bernstein-vazirani") {
        return [
            { type: "linechart", x: "n", y: "fidelity", options: { xlabel: "n", ylabel: "Fidelity" } },
            { type: "linechart", x: "n", y: "entropy", options: { xlabel: "n", ylabel: "Entropy" } },
            { type: "linechart", x: "n", y: "run_time", options: { xlabel: "n", ylabel: "Run time (sec)", yscale: "log" } },
            { type: "linechart", x: "n", y: "qpu_time", options: { xlabel: "n", ylabel: "QPU time (sec)", yscale: "log" } },
        ];
    }

    if (benchmark == "period-finding") {
        return [
            { type: "linechart", x: "n", y: "accuracy", options: { xlabel: "n", ylabel: "Accuracy" } },
            { type: "linechart", x: "n", y: "run_time", options: { xlabel: "n", ylabel: "Run time (sec)", yscale: "log" } },
            { type: "linechart", x: "n", y: "qpu_time", options: { xlabel: "n", ylabel: "QPU time (sec)", yscale: "log" } },
        ];
    }

    if (benchmark == "phase-estimation") {
        return [
            { type: "linechart", x: "n", y: "fidelity", options: { xlabel: "n", ylabel: "Fidelity" } },
            { type: "linechart", x: "n", y: "entropy", options: { xlabel: "n", ylabel: "Entropy" } },
            { type: "linechart", x: "n", y: "run_time", options: { xlabel: "n", ylabel: "Run time (sec)", yscale: "log" } },
            { type: "linechart", x: "n", y: "qpu_time", options: { xlabel: "n", ylabel: "QPU time (sec)", yscale: "log" } },
        ];
    }

    return [];
}