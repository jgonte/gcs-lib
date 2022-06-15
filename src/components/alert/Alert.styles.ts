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
}

:host([kind='info']) {
    background-color: var(--wcl-color-info);
    color: var(--wcl-color-on-info);
    border-color: var(--wcl-color-on-info);
}

:host([kind='success']) {
    background-color: var(--wcl-color-success);
    color: var(--wcl-color-on-success);
    border-color: var(--wcl-color-on-success);
}

:host([kind='warning']) {
    background-color: var(--wcl-color-warning);
    color: var(--wcl-color-on-warning);
    border-color: var(--wcl-color-on-warning);
}

:host([kind='error']) {
    background-color: var(--wcl-color-danger);
    color: var(--wcl-color-on-danger);
    border-color: var(--wcl-color-on-danger);
}`;
