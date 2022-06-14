import CustomElementPropertyMetadata, { ConversionTypes } from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { kindStyles } from "./Kind.styles";

export default function Kind<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class KindMixin extends Base {

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                kind: {
                    type: ConversionTypes.String,
                    inherit: true,
                    options: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'danger']
                    // mutable: true,
                    // reflect: true,
                }
            };
        }

        static get styles(): string {

            return kindStyles;
        }
    }
}