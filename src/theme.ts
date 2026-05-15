export type Theme = "light" | "dark";

const QUANTUM_BENCH_THEME = "QUANTUM_BENCH_THEME";

export function initTheme() {
    const theme = window.localStorage.getItem(QUANTUM_BENCH_THEME);
    if (theme !== null) document.body.className = theme;
}

export function setTheme(theme: Theme) {
    window.localStorage.setItem(QUANTUM_BENCH_THEME, theme);
    document.body.className = theme;
}

export function getTheme(): Theme {
    const theme = window.localStorage.getItem(QUANTUM_BENCH_THEME) as Theme | null;
    return theme || "light";
}
