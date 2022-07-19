import css from "../../../custom-element/styles/css";

export const selectableStyles = css`
:host([selected]) {
    box-sizing: content-box;
    border: solid 3px orange;
}`;