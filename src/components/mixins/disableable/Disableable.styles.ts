import css from "../../../custom-element/styles/css";

export const disableableStyles = css`
:host([disabled="true"]) {
    cursor: not-allowed;
}

*[disabled="true"] {
    cursor: not-allowed;
}`;