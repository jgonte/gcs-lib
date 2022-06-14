import css from "../../custom-element/styles/css";

export const localizedTextStyles = css`
:host {
    overflow-wrap: break-word;
}

:host([size='large']) {
    font-size: var(--wcl-font-size-large);
}

:host([size='medium']) {
    font-size: var(--wcl-font-size-medium);
}

:host([size='small']) {
    font-size: var(--wcl-font-size-small);
}`;