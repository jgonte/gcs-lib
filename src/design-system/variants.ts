import CustomHTMLElementConstructor from "../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import css from "../custom-element/styles/css";
import cssVariables from "./css-variables";

export const variants = ['outlined', 'text', 'contained'];

export default function createVariantStyles(ctor: CustomHTMLElementConstructor, kind: string): string {

    const styles: string[] = [];

    switch (ctor.name) {

        case "Button":
            {
                variants.forEach(variant => {

                    switch (variant) {
                        case 'outlined': // "Normal" layout with border
                            {
                                styles.push(
                                    css`
:host([kind='${kind}'][variant='${variant}']) button { 
    color: var(${cssVariables.get("color")}${kind}); 
    background-color: var(${cssVariables.get("background-color")}${kind}); 
    border-color: var(${cssVariables.get("color")}${kind}); 
}`
                                );
                            }
                            break;
                        case 'text': // No border, no background color
                            {
                                styles.push(
                                    css`
:host([kind='${kind}'][variant='${variant}']) button { 
    color: var(${cssVariables.get("color")}${kind});
}`
                                );
                            }
                            break;
                        case 'contained': // Invert the colors, no need for a border
                            {
                                styles.push(
                                    css`
:host([kind='${kind}'][variant='${variant}']) button { 
    color: var(${cssVariables.get("color-contained")}${kind}); 
    background-color: var(${cssVariables.get("background-color-contained")}${kind}); 
}`
                                );
                            }
                            break;
                        default: throw new Error(`createVariantStyles not implemented for variant: '${variant}'`);
                    }
                });
            }
            break;
        default: throw new Error(`createVariantStyles not implemented for type: '${ctor.name}'`);
    }

    return css`${styles.join('\n')}`;
}