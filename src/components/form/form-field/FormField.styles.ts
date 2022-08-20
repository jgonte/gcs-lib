import css from "../../../custom-element/styles/css";

export const formFieldStyles = css`
:host {
    display: block;
    background-color: pink;
}

#labeled-field {
    display: flex;
    flex-wrap: wrap;
    background-color: lightgreen;
}

#label-container {
    display: grid;
    grid-template-columns: 1fr auto;
    background-color: lightblue;
    flex-grow: 1;
}

#label {
    display: flex;
    align-items: center;
    background-color: yellow;
}

#tools {
    background-color: lightsalmon;
}

#field {
    display: flex;
    align-items: center;
    background-color: lightseagreen;
    flex-grow: 1;
}`;