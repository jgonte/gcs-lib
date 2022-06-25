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