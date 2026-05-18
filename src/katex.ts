
declare const renderMathInElement: any;

export function katex(elem: HTMLElement): HTMLElement {
    renderMathInElement(elem, KaTeXOptions);
    return elem;
}

const KaTeXOptions = {
    macros: {
        "\\id": "\\text{id}",
        "\\ZZ": "\\mathbb{Z}",
        "\\QQ": "\\mathbb{Q}",
        "\\CC": "\\mathbb{C}",
        "\\RR": "\\mathbb{R}",
        "\\NN": "\\mathbb{N}",
        "\\PP": "\\mathbb{P}",
        "\\AA": "\\mathbb{A}",
        "\\FF": "\\mathbb{F}",
        "\\GG": "\\mathbb{G}",
        "\\EE": "\\mathbb{E}",
        "\\textup": "\\text{#1}",
        "\\im": "\\operatorname{im}",
        "\\colim": "\\mathop{\\operatorname{colim}}\\limits",
        "\\coker": "\\operatorname{coker}",
        "\\tr": "\\operatorname{tr}",
        "\\bdot": "\\bullet",
        "\\norm": "{\\left\\|#1\\right\\|}",
        "\\mod": "\\text{ mod }",
        "\\mapsfrom": "\\leftarrow\\mathrel{\\mkern-3.2mu\\raisebox{.7mu}{$\\shortmid$}}",
        "\\isom": "\\cong",
        "\\braket": "\\langle #1 \\! \\mid \\! #2 \\rangle",
        "\\U": "\\textup{U}",
        "\\SU": "\\textup{SU}",
        "\\O": "\\textup{O}",
        "\\SO": "\\textup{SO}",
    },
    delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false }
    ]
};
