import css from "../../../../custom-element/styles/css";

export const dataRowStyles = css`
:host {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    line-height: 1.5;
    border-bottom: 1px solid var(--surface4);
}

:host(:nth-of-type(even)) {
    background-color: var(--surface2);
}

:host(:nth-of-type(odd)) {
    background-color: var(--surface3);
}`;