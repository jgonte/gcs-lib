import CustomElementPropertyMetadata, { ConversionTypes } from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";

export default function Kind<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class KindMixin extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                kind: {
                    type: ConversionTypes.String,
                    inherit: true,
                    options: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error']
                    // mutable: true,
                    // reflect: true,
                }
            };
        }
    }
}