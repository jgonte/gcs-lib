import css from "../../../custom-element/styles/css";

export const formFieldStyles = css`
:host {
    display: block;
    margin: 3px;
    border: 3px solid red;
}

#labeled-field {
    display: flex;
    flex-wrap: wrap;
    margin: 3px;
    border: 3px solid green;
}

#label-container {
    display: grid;
    grid-template-columns: 1fr auto;
    margin: 3px;
    border: 3px solid darksalmon;
}

#label {
    margin: 3px;
    border: 3px solid blue;
}

#tools {
    margin: 3px;
    border: 3px solid violet;
}

#field {
    margin: 3px;
    border: 3px solid orange;
    flex-grow: 1;
}`;