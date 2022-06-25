import CustomElementPropertyMetadata, { ConversionTypes } from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import createKindStyles, { kinds } from "../../../design-system/kinds";

export default function Kind<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class KindMixin extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                kind: {
                    type: ConversionTypes.String,
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