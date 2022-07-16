import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import css from "../../../custom-element/styles/css";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import cssVariables from "../../../design-system/css-variables";
import createVariantStyles from "../../../design-system/variants";
import { DataTypes } from "../../../utils/data/DataTypes";

const kinds = ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'danger'];

function createKindStyles(ctor: CustomHTMLElementConstructor): string {

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

export default function Kind<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class KindMixin extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                kind: {
                    type: DataTypes.String,
                    options: kinds,
                    inherit: true,
                    // reflect: true,
                }
            };
        }

        static get styles(): string {

            return mergeStyles(super.styles, createKindStyles(this));
        }
    }
}