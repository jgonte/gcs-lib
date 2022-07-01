import CustomHTMLElementConstructor from "../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import css from "../custom-element/styles/css";
import cssVariables from "./css-variables";

export const sizes = ['large', 'medium', 'small'];

export default function createSizeStyles(ctor: CustomHTMLElementConstructor): string {

    const styles: string[] = [];

    switch (ctor.name) {
        case "Icon":
        case "LocalizedText":
            {
                sizes.forEach(
                    size => styles.push(
                        css`
:host([size='${size}']) {
    font-size: var(${cssVariables.get("font-size")}${size});
}`
                    )
                );
            }
            break;
        case "Badge": // The height of the badge should correspond to the size of the font
            {
                sizes.forEach(
                    size => styles.push(
                        css`
:host([size='${size}']) {
    max-height: var(${cssVariables.get("font-size")}${size});
    font-size: calc(var(${cssVariables.get("font-size")}${size}) - 2px);
}`
                    )
                );
            }
            break;
        case "TextField":
            {
                sizes.forEach(
                    size => styles.push(
                        css`
:host([size='${size}']) input[type='text'] {
    font-size: var(${cssVariables.get("font-size")}${size});
    padding: var(${cssVariables.get("padding")}${size});
    height: var(${cssVariables.get("min-height")}${size});
}`
                    )
                );
            }
            break;
        default: {
            sizes.forEach(
                size => styles.push(
                    css`
:host([size='${size}']) {
    font-size: var(${cssVariables.get("font-size")}${size});
    padding: var(${cssVariables.get("padding")}${size});
    min-height: var(${cssVariables.get("min-height")}${size});
}`
                )
            );
        }
            break;
    }

    return css`${styles.join('\n')}`;
}