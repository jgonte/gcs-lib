import CustomElementPropertyMetadata, { ConversionTypes } from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { variants } from "../../../design-system/variants";

export default function Variant<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class VariantMixin extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                  * The variant of the button
                  */
                variant: {
                    type: ConversionTypes.String,
                    value: variants[0],
                    reflect: true,
                    options: variants
                }
            };
        }

        // The Kind mixin also handles the variant styles since they are related
    }
}