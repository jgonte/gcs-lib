import css from "../../../custom-element/styles/css";

export const navigationBarStyles = css`
:host {
    display: inline-block;
    flex-basis: 250px;
    flex-shrink: 0;
}

.sidebar {
    background: var(--wcl-background-color-primary);
    color: var(--wcl-color-primary);
}`;