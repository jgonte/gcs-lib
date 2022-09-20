import css from "../../../custom-element/styles/css";

export const navigationLinkStyles = css`
:host {
    display: block;
}

:host([active]) {
    background-color: var(--active-bg-color);
    color: var(--active-text-color);
	transition: all 0.3s ease;
}

:host([active]:hover) {
    background-color: var(--active-hover-bg-color);
    color: var(--active-hover-text-color);
    transition: all 0.3s ease;
}`;