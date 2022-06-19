import CustomElementPropertyMetadata, { ConversionTypes } from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { sizableStyles } from "./Sizable.styles";

export default function Sizable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class SizableMixin extends Base {

        static get styles(): string {

            if (this.atomic === true) { // Do not include the Sizable styles

                return super.styles as string;
            }
            else {

                return mergeStyles(super.styles, sizableStyles);
            }
        }

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                size: {
                    type: ConversionTypes.String,
                    value: 'medium',
                    reflect: true,
                    inherit: true,
                    options: ['small', 'large', 'medium']
                }
            };
        }
    }
}