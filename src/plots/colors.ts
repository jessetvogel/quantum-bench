export function color(i: number): string {
    const colors = [
        "var(--blue)",
        "var(--yellow)",
        "var(--green)",
        "var(--red)",
        "var(--indigo)",
        "var(--orange)",
        "var(--purple)",
        "var(--teal)",
        "var(--pink)",
        "var(--aubergine)",
    ]
    return colors[i % colors.length];
}