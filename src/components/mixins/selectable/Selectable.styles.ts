import css from "../../../custom-element/styles/css";

export const selectableStyles = css`
:host() {
    border: solid 5px white;
}

:host([selected]) {
    border: solid 5px darkred;
}`;