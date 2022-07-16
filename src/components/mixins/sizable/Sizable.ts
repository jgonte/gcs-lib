import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import css from "../../../custom-element/styles/css";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import cssVariables from "../../../design-system/css-variables";
import { DataTypes } from "../../../utils/data/DataTypes";

const sizes = ['large', 'medium', 'small'];

function createSizeStyles(ctor: CustomHTMLElementConstructor): string {

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
    margin: var(${cssVariables.get("margin")}${size});
}`
                )
            );
        }
            break;
    }

    return css`${styles.join('\n')}`;
}

export default function Sizable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class SizableMixin extends Base {

        static get styles(): string {

            return mergeStyles(super.styles, createSizeStyles(this));
        }

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                size: {
                    type: DataTypes.String,
                    value: sizes[1], //medium
                    reflect: true,
                    inherit: true,
                    options: sizes
                }
            };
        }
    }
}