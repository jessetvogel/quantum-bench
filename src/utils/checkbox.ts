import "./checkbox.css";

type Options = {
    checked?: boolean;
    onclick?: (checked: boolean) => void;
};

export function Checkbox(text: string, options: Options = {}): HTMLElement {
    const label = document.createElement("label");
    label.classList.add("checkbox");
    label.append(text);

    if (options?.checked) {
        label.classList.add("checked");
    }

    function click() {
        let checked: boolean;
        if (label.classList.contains("checked")) {
            label.classList.remove("checked");
            checked = false;
        }
        else {
            label.classList.add("checked");
            checked = true;
        }

        options.onclick?.(checked);
    }

    label.addEventListener("click", click);

    return label;
}
