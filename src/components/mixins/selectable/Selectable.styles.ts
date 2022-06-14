import css from "../../../custom-element/styles/css";

export const selectableStyles = css`
:host {
    cursor: pointer;
    box-sizing: border-box;
    display: inline-block;
    width: 100%; /* Take all the width of its parent */
}

:host([selected='true']) {
    border: solid 3px darkgreen;
}`;