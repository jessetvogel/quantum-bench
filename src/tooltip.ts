import * as d3 from "d3";
import { create } from "./html";
import { katex } from "./katex";

export function showTooltip(event: MouseEvent, text: string) {
    const t = tooltip();
    t.innerHTML = text;
    t.style.display = "block";
    t.style.left = event.pageX + 8 + "px";
    t.style.top = event.pageY + 8 + "px";
    katex(t);
}

export function hideTooltip() {
    const t = tooltip();
    t.style.display = "none";
}

function tooltip(): HTMLElement {
    let t = document.getElementById("tooltip");
    if (t == null) {
        t = create("div", {
            id: "tooltip", style: {
                "display": "none",
                "position": "absolute",
                "background": "var(--bg)",
                "border": "1px solid var(--border)",
                "border-radius": "24px",
                "box-shadow": "var(--shadow)",
                "padding": "8px 12px 4px 12px",
            }
        });

        document.body.append(t);
    }
    return t;
}

export function helpIcon(
    svg: d3.Selection<SVGSVGElement, undefined, null, undefined>,
    x: number,
    y: number,
    text: string) {
    const g = svg.append("g");

    g.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 12)
        .attr("fill", "var(--bg)")
        .attr("stroke", "var(--border)")
    g.append("text")
        .attr("x", x)
        .attr("y", y + 2)
        .attr("font-family", "var(--font-mono)")
        .attr("font-weight", "bold")
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text("?")
    g.style("cursor", "default")
        .on("mousemove", e => showTooltip(e, text))
        .on("mouseout", () => hideTooltip())

    return g;
}