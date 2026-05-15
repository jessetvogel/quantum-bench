export type Benchmark = {
    id: number,
    name: string,
    parameters: string[],
    metrics: string[],
};

export type Backend = {
    id: number,
    name: string,
};

export type Run = {
    id: number,
    benchmark: Benchmark,
    backend: Backend,
    parameters: { [param: string]: string | number },
    metrics: { [param: string]: string | number },
}

const DEFAULT_METRICS = ["circuit_depths", "circuit_widths", "transpile_time", "qpu_time", "runtime"];

export function benchmarks(): Benchmark[] {
    return [
        { id: 0, name: "Grover", parameters: ["n"], metrics: [...DEFAULT_METRICS, "accuracy", "entropy"] },
        { id: 1, name: "Period finding", parameters: ["n"], metrics: [...DEFAULT_METRICS, "accuracy"] },
        { id: 2, name: "Phase estimation", parameters: ["n"], metrics: [...DEFAULT_METRICS, "fidelity", "entropy", "mean_squared_error"] },
        { id: 3, name: "Bernstein-Vazirani", parameters: ["n"], metrics: [...DEFAULT_METRICS, "fidelity", "entropy"] },
    ]
}

export function backends(): Backend[] {
    return [
        { id: 0, name: "qiskit_aer" },
        { id: 1, name: "ibm_aachen" },
        { id: 2, name: "ibm_berlin" },
        { id: 3, name: "ibm_strasbourg" },
        { id: 4, name: "ibm_brussels" },
        { id: 5, name: "ibm_miami" },
    ]
}

export async function loadRuns(benchmark: Benchmark, backends: Set<Backend>): Promise<Run[]> {
    const data = await ((await fetch(`data/${benchmark.name}.json`)).json());

    const runs: Run[] = [];

    let id = 0;

    for (const entry of data["data"]) {
        const backend = findBackend(backends, entry["backend"]);
        if (backend === null) continue;

        runs.push({
            id,
            backend,
            benchmark,
            parameters: Object.fromEntries(benchmark.parameters.map(param => [param, entry[param]])),
            metrics: Object.fromEntries(benchmark.metrics.map(metric => [metric, entry[metric]])),
        });

        id += 1;
    }

    return runs;
}

function findBackend(backends: Set<Backend>, name: string): Backend | null {
    for (const backend of backends) {
        if (backend.name == name)
            return backend;
    }
    return null;
}