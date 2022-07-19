import css from "../../../custom-element/styles/css";

export const hoverableStyles = css`
:host([hoverable]:hover) {
    box-sizing: content-box;
    border: solid 3px cyan;
}`;