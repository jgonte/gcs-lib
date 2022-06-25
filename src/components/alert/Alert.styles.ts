import css from "../../custom-element/styles/css";

export const alertStyles = css`
:host {
    display: flex;
    align-items: center;  
    justify-content: space-between;
    border-style: solid;
    border-width: var(--wcl-border-width);
    column-gap: 1rem;
    border-radius: 4px;
    max-width: 80%;
    padding: 1rem;
    word-break: normal;
}`;
