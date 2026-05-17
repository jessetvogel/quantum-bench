export type Backend = {
    id: string,
    name: string,
    description: string,
    type: string,
    chip: string,
    qubits: number,
};

export type Benchmark = {
    id: string,
    name: string,
    description: string,
    parameters: { [name: string]: string },
    metrics: { [name: string]: string },
};

export type Result = {
    benchmark: string,
    backend: string,
    parameters: { [name: string]: any },
    metrics: { [name: string]: any },
    datetime: string, // ISO 8601
};

// const DEFAULT_METRICS = ["circuit_depths", "circuit_widths", "transpile_time", "qpu_time", "runtime"];

let data: {
    backends: { [id: string]: Backend },
    benchmarks: { [id: string]: Benchmark },
    results: Result[],
} | null = null;

export function backends(): { [id: string]: Backend } {
    if (data === null) return {};

    return data.backends;

    // return [
    //     { id: 0, name: "qiskit_aer" },
    //     { id: 1, name: "ibm_aachen" },
    //     { id: 2, name: "ibm_berlin" },
    //     { id: 3, name: "ibm_strasbourg" },
    //     { id: 4, name: "ibm_brussels" },
    //     { id: 5, name: "ibm_miami" },
    // ]
}

export function benchmarks(): { [id: string]: Benchmark } {
    if (data === null) return {};

    return data.benchmarks;

    // return [
    //     { id: 0, name: "Grover", parameters: ["n"], metrics: [...DEFAULT_METRICS, "accuracy", "entropy"] },
    //     { id: 1, name: "Period finding", parameters: ["n"], metrics: [...DEFAULT_METRICS, "accuracy"] },
    //     { id: 2, name: "Phase estimation", parameters: ["n"], metrics: [...DEFAULT_METRICS, "fidelity", "entropy", "mean_squared_error"] },
    //     { id: 3, name: "Bernstein-Vazirani", parameters: ["n"], metrics: [...DEFAULT_METRICS, "fidelity", "entropy"] },
    // ]
}

export function results(benchmark: string, backends: Set<string>): Result[] {
    if (data === null) return [];

    const results: Result[] = [];
    for (const result of data.results) {
        if (result.benchmark != benchmark) continue;
        if (![...backends].some(backend => backend == result.backend)) continue;

        results.push(result);
    }

    return results;
}

export async function fetchData() {
    const response = await fetch("data/data.json");
    data = await response.json();
}
