import css from "../../../custom-element/styles/css";

export const hoverableStyles = css`
:host {
    border: solid 5px transparent;
}

:host([hoverable]:hover) {
    border: solid 5px lightpink;
    transition: all 1s ease;
}`;