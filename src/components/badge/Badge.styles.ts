import css from "../../custom-element/styles/css";

export const badgeStyles = css`
:host {
    display:inline-block;
    font-size: .5rem;
    min-width: .7rem;
    height: .7rem;
    padding: .2rem;
    text-align: center;
    vertical-align: middle;
    border-radius: 50%;
    box-shadow: 0 0 1px #333;
}

:host([kind='primary']) {
    background-color: var(--wcl-color-primary);
    color: var(--wcl-color-on-primary);
}

:host([kind='secondary']) {
    background-color: var(--wcl-color-secondary);
    color: var(--wcl-color-on-secondary);
}

:host([kind='tertiary']) {
    background-color: var(--wcl-color-tertiary);
    color: var(--wcl-color-on-tertiary);
}`;