import CustomHTMLElementConstructor from "../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import css from "../custom-element/styles/css";
import cssVariables from "./css-variables";

export const sizes = ['large', 'medium', 'small'];

export default function createSizeStyles(ctor: CustomHTMLElementConstructor): string {

    const styles: string[] = [];

    // Common css
    styles.push(css`
:host {
    min-height: var(${cssVariables.get("min-height")});
    margin: var(${cssVariables.get("margin")});
}`
    );

    // Size specific
    sizes.forEach(size => {

        // Size specific style
        switch (ctor.name) {

            case "Button":
                {
                    styles.push(css`
:host([size='${size}']) button {
    font-size: var(${cssVariables.get("font-size")}${size});
}`
                    );
                }
                break;
            case "TextField":
                {
                    styles.push(css`
:host([size='${size}']) input[type='text'] {
    font-size: var(${cssVariables.get("font-size")}${size});
}`
                    );
                }
                break;
            default:
                {
                    styles.push(css`
:host([size='${size}']) {
    font-size: var(${cssVariables.get("font-size")}${size});
}`
                    );
                }
                break;
        }

    });

    return css`${styles.join('\n')}`;
}