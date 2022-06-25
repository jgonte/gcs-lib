import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import CustomElementPropertyMetadata, { ConversionTypes } from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Sizable from "../mixins/sizable/Sizable";
import Kind from "../mixins/kind/Kind";
import Variant from "../mixins/variant/Variant";
import { buttonStyles } from "./Button.styles";

export default class Button extends
    Sizable(
        Variant(
            Kind(
                CustomElement as CustomHTMLElementConstructor
            )
        )
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, buttonStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * Callback when the button is clicked
             */
            click: {
                type: ConversionTypes.Function,
                defer: true
            }
        };
    }

    render(): NodePatchingData | NodePatchingData[] | null {

        return html`<button onClick=${this.click}>
            <slot></slot>
        </button>`;
    }

}

defineCustomElement('wcl-button', Button);