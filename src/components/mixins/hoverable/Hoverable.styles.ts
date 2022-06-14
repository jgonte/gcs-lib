import css from "../../../custom-element/styles/css";

export const hoverableStyles = css`
:host([hoverable="true"]:hover) {
    background-color: var(--wcl-hoverable-background-color);
    color: var(--wcl-hoverable-color);
}

*[hoverable="true"]:hover {
    background-color: var(--wcl-hoverable-background-color);
    color: var(--wcl-hoverable-color);
}`;