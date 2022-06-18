import css from "../../../custom-element/styles/css";

export const sizableStyles = css`
/* SizableMixin */
/* host applies to the text component */
:host([size='large']) *{
    /* padding: var(--wcl-padding-size-large); */
    font-size: var(--wcl-font-size-large);
    min-height: var(--wcl-min-height-large);
}

:host([size='medium']) *{
    /* padding: var(--wcl-padding-size-medium); */
    font-size: var(--wcl-font-size-medium);
    min-height: var(--wcl-min-height-medium);
}

:host([size='small']) *{
    /* padding: var(--wcl-padding-size-small);  */
    font-size: var(--wcl-font-size-small);
    min-height: var(--wcl-min-height-small);
}`;
