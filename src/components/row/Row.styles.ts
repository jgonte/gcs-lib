import css from "../../custom-element/styles/css";

export const rowStyles = css`
:host {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

:host * {
    flex-grow: 1;
}

:host([justify-content='start']) {
    justify-content: start;
}

:host([justify-content='end']) {
    justify-content: end;
}

:host([justify-content='center']) {
    justify-content: center;
}

:host([justify-content='space-around']) {
    justify-content: space-around;
}

:host([justify-content='space-between']) {
    justify-content: space-between;
}

:host([justify-content='space-evenly']) {
    justify-content: space-evenly;
}`;