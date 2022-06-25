import CustomHTMLElementConstructor from "../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import css from "../custom-element/styles/css";
import cssVariables from "./css-variables";
import createVariantStyles from "./variants";

export const kinds = ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'danger'];

export default function createKindStyles(ctor: CustomHTMLElementConstructor): string {

    const styles: string[] = [];

    switch (ctor.name) {

        // Do not use the background color for these
        case "Icon":
        case "LocalizedText":
            {
                kinds.forEach(
                    kind => styles.push(
                        css`
:host([kind='${kind}']) { 
    color: var(${cssVariables.get("color")}${kind});
}`
                    )
                );
            }
            break;
        // Include the variants
        case "Button":
            {
                kinds.forEach(kind =>
                    styles.push(createVariantStyles(ctor, kind))
                );
            }
            break;
        default:
            {
                kinds.forEach(
                    kind => styles.push(
                        css`
:host([kind='${kind}']) { 
    color: var(${cssVariables.get("color")}${kind}); 
    background-color: var(${cssVariables.get("background-color")}${kind}); 
}`
                    )
                );
            }
            break;
    }

    return css`${styles.join('\n')}`;
}