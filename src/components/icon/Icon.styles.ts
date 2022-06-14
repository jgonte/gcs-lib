import css from "../../custom-element/styles/css";

export const iconStyles = css`
:host svg {
    display: inline-block;
    width: 1em;
    height: 1em;
    color: inherit;
}

:host([size='large']) {
    font-size: var(--wcl-icon-size-large);
}

:host([size='medium']) {
    font-size: var(--wcl-icon-size-medium);
}

:host([size='small']) {
    font-size: var(--wcl-icon-size-small);
}`;