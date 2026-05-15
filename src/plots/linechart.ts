import * as d3 from "d3";
import { color } from "./colors";

export type Series = {
    [key: string]: { x: number, y: number }[],
};

type Options = {
    width?: number,
    height?: number,
    xlabel?: string,
    ylabel?: string,
    xscale?: "linear" | "log",
    yscale?: "linear" | "log",
    grid?: boolean,
    legend?: boolean,
    colors?: { [key: string]: string },
};

export function LineChart(
    series: Series,
    options: Options = {}
): SVGElement {
    const width = options?.width || 512;
    const height = options?.height || 512;
    const margin = { top: 8, right: 8, bottom: 48, left: 64 };

    const keys = Object.keys(series);

    // Colors
    const colors = options?.colors || Object.fromEntries(keys.map((key, i) => [key, color(i)]));

    // SVG
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("overflow", "visible");

    // Scales
    const xscale = (options?.xscale === "log") ? d3.scaleLog() : d3.scaleLinear();
    const yscale = (options?.yscale === "log") ? d3.scaleLog() : d3.scaleLinear();

    const x = xscale
        .domain(xdomain(series)).nice()
        .range([margin.left, width - margin.right]);

    const y = yscale
        .domain(ydomain(series)).nice()
        .range([height - margin.bottom, margin.top]);

    if (options.grid) {
        // x-grid
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(
                d3.axisBottom(x)
                    .tickSize(-(height - margin.top - margin.bottom))
                    .tickFormat(() => "")
            )
            .call(g => g.selectAll("line").attr("stroke", "rgba(127, 127, 127, 0.2)"))

        // y-grid
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(
                d3.axisLeft(y)
                    .tickSize(-(width - margin.left - margin.right))
                    .tickFormat(() => "")
            )
            .call(g => g.selectAll("line").attr("stroke", "rgba(127, 127, 127, 0.2)"));
    }

    // Line generator
    const line = d3.line<{ x: number; y: number }>()
        .x(d => x(d.x))
        .y(d => y(d.y));

    // Plot series
    for (const key of keys) {
        // Plot scatter
        svg.append('g')
            .selectAll("dot")
            .data(series[key])
            .enter()
            .append("circle")
            .attr("cx", d => x(d.x))
            .attr("cy", d => y(d.y))
            .attr("r", 4)
            .style("fill", colors[key])

        // Plot line
        const path = svg.append("path")
            .datum(series[key])
            .attr("fill", "none")
            .attr("stroke", colors[key])
            .attr("stroke-width", 2)
            .attr("d", line)
            .style("opacity", 0.5);

        // Animate line
        const totalLength = path.node()!.getTotalLength();

        path
            .attr("stroke-dasharray", totalLength)
            .attr("stroke-dashoffset", totalLength);

        path.transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
    }

    // x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .attr("font-family", "var(--font-sans)");

    // x-label
    if (options?.xlabel) {
        svg.append("text")
            .attr("x", margin.left + (width - margin.left - margin.right) / 2)
            .attr("y", height - 8)
            .attr("text-anchor", "middle")
            .style("font-size", "1rem")
            .style("font-weight", "bold")
            .attr("fill", "currentColor")
            .text(options.xlabel);
    }

    // y-axis
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .attr("font-family", "var(--font-sans)");

    // y-label
    if (options?.ylabel) {
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(margin.top + (height - margin.top - margin.bottom) / 2))
            .attr("y", 15)
            .attr("fill", "currentColor")
            .attr("text-anchor", "middle")
            .style("font-size", "1rem")
            .style("font-weight", "bold")
            .text(options.ylabel);
    }

    if (options.legend) {
        // legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width - margin.right - 120}, ${margin.top})`);

        keys.forEach((key, i) => {
            const row = legend.append("g")
                .attr("transform", `translate(0, ${i * 18})`);

            row.append("rect")
                .attr("width", 120)
                .attr("height", 18)
                .attr("fill", "rgba(255, 255, 255, 0.5)");

            row.append("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", colors[key]);

            row.append("text")
                .attr("x", 15)
                .attr("y", 9)
                .attr("fill", "currentColor")
                .style("font-size", "12px")
                .text(key);
        });
    }

    return svg.node()!;
}

function xdomain(series: Series): [number, number] {
    const allX = Object.values(series).flatMap(s => s.map(d => d.x));
    return d3.extent(allX) as [number, number];
}

function ydomain(series: Series): [number, number] {
    const allY = Object.values(series).flatMap(s => s.map(d => d.y));
    return d3.extent(allY) as [number, number];
}
