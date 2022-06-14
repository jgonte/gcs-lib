import css from "../../../custom-element/styles/css";

export const kindStyles = css`
/* KindMixin */
/* host applies to the text component*/
:host([kind='primary']),
*[kind='primary'] {
    color: var(--wcl-color-on-primary);
}

:host([kind='secondary']),
*[kind='secondary'] {
    color: var(--wcl-color-on-secondary);
}

:host([kind='tertiary']),
*[kind='tertiary'] {
    color: var(--wcl-color-on-tertiary);
}

:host([kind='info']),
*[kind='info'] {
    color: var(--wcl-color-on-info);
}

:host([kind='success']),
*[kind='success'] {
    color: var(--wcl-color-on-success);
}

:host([kind='warning']),
*[kind='warning'] {
    color: var(--wcl-color-on-warning);
}

:host([kind='danger']),
*[kind='danger'] {
    color: var(--wcl-color-on-danger);
}

:host([kind='light']),
*[kind='light'] {
    color: var(--wcl-color-on-light);
}

:host([kind='medium']),
*[kind='medium'] {
    color: var(--wcl-color-on-medium);
}

:host([kind='dark']),
*[kind='dark'] {
    color: var(--wcl-color-on-dark);
}`;