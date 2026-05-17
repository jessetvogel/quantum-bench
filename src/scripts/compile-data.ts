import fs from "node:fs";
import { join } from "node:path";
import type { Backend, Benchmark, Result } from "../data";

const PATH_BENCHMARKS = "./data/benchmarks";
const PATH_BACKENDS = "./data/backends";
const PATH_RESULTS = "./data/results";
const PATH_OUTPUT = "./public/data/data.json"

let anyErrors: boolean;

function main() {
    anyErrors = false;

    const backends = parseBackends(PATH_BACKENDS);
    const benchmarks = parseBenchmarks(PATH_BENCHMARKS);
    const results = parseResults(PATH_RESULTS, backends, benchmarks);

    if (anyErrors) process.exit(1)

    writeJSON(PATH_OUTPUT, { backends, benchmarks, results });
    console.log("\x1b[32;1mdone\x1b[0m");
}

function parseBenchmarks(path: string): { [name: string]: Benchmark } {
    const benchmarks: { [name: string]: Benchmark } = {};

    for (const file of fs.readdirSync(path)) {
        if (!file.endsWith(".json")) continue; // parse only JSON files

        const filepath = join(path, file);
        try {
            const data = fs.readFileSync(filepath, { encoding: "utf8" });
            const benchmark = parseBenchmark(JSON.parse(data));
            if (benchmark.id in benchmarks) throw `benchmark with name '${benchmark.id}' already exists`;
            benchmarks[benchmark.id] = benchmark;
        }
        catch (err) {
            errorInFile(filepath, err);
        }
    }

    return benchmarks;
}

function parseBackends(path: string): { [name: string]: Backend } {
    const backends: { [name: string]: Backend } = {};

    for (const file of fs.readdirSync(path)) {
        if (!file.endsWith(".json")) continue; // parse only JSON files

        const filepath = join(path, file);
        try {
            const data = fs.readFileSync(filepath, { encoding: "utf8" });
            const backend = parseBackend(JSON.parse(data));

            if (backend.id in backends) throw `backend with name '${backend.id}' already exists`;

            backends[backend.id] = backend;
        } catch (err) {
            errorInFile(filepath, err);
        }
    }

    return backends;
}

function parseResults(
    path: string,
    backends: { [name: string]: Backend },
    benchmarks: { [name: string]: Benchmark }
): Result[] {
    const results: Result[] = [];

    for (const file of fs.readdirSync(path)) {
        if (!file.endsWith(".json")) continue; // parse only JSON files

        const filepath = join(path, file);
        try {
            const json = fs.readFileSync(filepath, { encoding: "utf8" });
            const data = JSON.parse(json);

            if (!Array.isArray(data)) throw `expected list of results, got '${typeof data}'`;

            for (const entry of data) {
                const result = parseResult(entry);

                if (!(result.backend in backends)) throw `unknown backend '${result.backend}'`;
                if (!(result.benchmark in benchmarks)) throw `unknown benchmark '${result.benchmark}'`;

                for (const parameter in result.parameters) {
                    if (!(parameter in benchmarks[result.benchmark].parameters))
                        throw `found parameter '${parameter}', which does not belong to benchmark '${result.benchmark}'`;
                }

                for (const parameter in benchmarks[result.benchmark].parameters) {
                    if (!(parameter in result.parameters))
                        throw `missing parameter '${parameter}' for result of benchmark '${result.benchmark}'`;
                }

                for (const metric in benchmarks[result.benchmark].metrics) {
                    if (!(metric in result.metrics))
                        throw `missing metric '${metric}' for result of benchmark '${result.benchmark}'`;
                }

                results.push(result);
            }
        } catch (err) {
            errorInFile(filepath, err);
        }
    }

    return results;
}

function parseBenchmark(data: any): Benchmark {
    const id = parseString(data, "id");
    const name = parseString(data, "name");
    const description = parseString(data, "description");
    const parameters = parseObjectString(data, "parameters");
    const metrics = parseObjectString(data, "metrics");

    return { id, name, description, parameters, metrics }
}

function parseBackend(data: any): Backend {
    const id = parseString(data, "id");
    const name = parseString(data, "name");
    const description = parseString(data, "description");
    const type = parseString(data, "type");
    const chip = parseString(data, "chip");
    const qubits = parseNumber(data, "qubits");

    return { id, name, description, type, chip, qubits }
}

function parseResult(data: any): Result {
    const backend = parseString(data, "backend");
    const benchmark = parseString(data, "benchmark");
    const parameters = parseObject(data, "parameters");
    const metrics = parseObject(data, "metrics");
    const datetime = parseDatetime(data, "datetime");

    return { backend, benchmark, parameters, metrics, datetime }
}

function parseString(data: any, key: string): string {
    if (!(key in data)) throw `missing field '${key}'`;
    const value = data[key];
    if (typeof value !== "string") throw `expected field '${key}' of type 'string', got '${typeof value}'`;
    return value;
}

function parseNumber(data: any, key: string): number {
    if (!(key in data)) throw `missing field '${key}'`;
    const value = data[key];
    if (typeof value !== "number") throw `expected field '${key}' of type 'number', got '${typeof value}'`;
    return value;
}

function parseObject(data: any, key: string): { [key: string]: any } {
    if (!(key in data)) throw `missing field '${key}'`;
    const value = data[key];
    if (typeof value !== "object") throw `expected field '${key}' of type 'object', got '${typeof value}'`;
    for (const k of Object.keys(value)) {
        if (typeof k !== "string") throw `expected keys of field ${key}' of type 'string', got '${typeof k}'`;
    }
    return value;
}

function parseObjectString(data: any, key: string): { [key: string]: string } {
    if (!(key in data)) throw `missing field '${key}'`;
    const value = data[key];
    if (typeof value !== "object") throw `expected field '${key}' of type 'object', got '${typeof value}'`;
    for (const [k, v] of Object.entries(value)) {
        if (typeof k !== "string") throw `expected keys of field ${key}' of type 'string', got '${typeof k}'`;
        if (typeof v !== "string") throw `expected values of field ${key}' of type 'string', got '${typeof v}'`;
    }
    return value;
}

function parseDatetime(data: any, key: string): string {
    if (!(key in data)) throw `missing field '${key}'`;
    const value = data[key];
    if (typeof value !== "string") throw `expected field '${key}' of type 'string', got '${typeof value}'`;
    const timestamp = Date.parse(value);
    if (isNaN(timestamp)) throw `expected field '${key}' to be datetime, got '${value}'`;
    return new Date(timestamp).toISOString();
}

function writeJSON(path: string, data: any) {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        error(`failed to write to '\x1b[30m${path}\x1b[0m': ${err}`)
    }
}

function errorInFile(path: string, err: any) {
    error(`${err} (in file '\x1b[30m${path}\x1b[0m')`);
}

function error(msg: string) {
    anyErrors = true;
    console.log(`\x1b[31;1merror\x1b[0m: ${msg}`);
}

main();
