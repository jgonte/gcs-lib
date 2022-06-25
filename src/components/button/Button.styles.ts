import css from "../../custom-element/styles/css";

export const buttonStyles = css`
button {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    cursor: pointer;
    border-width: var(--wcl-border-width);
    background: var(--wcl-background-color);
    column-gap: 1rem;
    border-radius: 4px;
    /* outline: 0;
      margin-right: 8px;
      margin-bottom: 12px;
      line-height: 1.5715;
      position: relative;
    
      font-weight: 400;
      white-space: nowrap;
      text-align: center;
      background-image: none;
      border: 1px solid transparent;
      -webkit-box-shadow: 0 2px 0 rgba(0, 0, 0, .015);
      box-shadow: 0 2px 0 rgba(0, 0, 0, .015);
      -webkit-transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      user-select: none;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
      
      color: rgba(0, 0, 0, .65);
      
      border-color: #d9d9d9; */
}

:host([variant='outlined']) button {
    border-style: solid;
}

:host([variant='text']) button {
    border-style: none;
}

/*

Contained buttons
:host([variant='contained'][kind='primary']) button {
    background-color: var(--wcl-color-primary);
    color: var(--wcl-color-on-primary);
}

:host([variant='contained'][kind='secondary']) button {
    background-color: var(--wcl-color-secondary);
    color: var(--wcl-color-on-secondary);
}

:host([variant='contained'][kind='tertiary']) button {
    background-color: var(--wcl-color-tertiary);
    color: var(--wcl-color-on-tertiary);
}

:host(:not([variant='contained'])[kind='primary']) button {
    color: var(--wcl-color-primary);
}

:host(:not([variant='contained'])[kind='secondary']) button {
    color: var(--wcl-color-secondary);
}

:host(:not([variant='contained'])[kind='tertiary']) button {
    color: var(--wcl-color-tertiary);
}


:host([kind='primary']) button {
    border-color: var(--wcl-color-primary);
}

:host([kind='secondary']) button {
    border-color: var(--wcl-color-secondary);
}

:host([kind='tertiary']) button {
    border-color: var(--wcl-color-tertiary);
}
*/`;