import css from "../../../../custom-element/styles/css";

export const dataRowStyles = css`
:host {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    line-height: 1.5;
    border-bottom: 1px solid #d0d0d0;
}

:host(:nth-of-type(even)) {
    background-color: #f2f2f2;
}

:host(:nth-of-type(odd)) {
    background-color: #ffffff;
}`;