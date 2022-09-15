import css from "../../../custom-element/styles/css";

export const hoverableStyles = css`
:host {
    filter: brightness(100%);
}

:host([hoverable]:hover) {
    filter: brightness(80%);
    transition: all 1s ease;
}`;