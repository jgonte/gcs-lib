import css from "../../custom-element/styles/css";

export const alertStyles = css`
:host {
    display: flex;
    align-items: center;  
    justify-content: space-between;
    border-style: solid;
    border-width: var(--wcl-border-width);
    column-gap: 1rem;
    border-radius: var(--wcl-border-radius);
    max-width: 80%;
    word-break: normal;
}`;