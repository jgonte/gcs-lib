import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata, { ConversionTypes } from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Kind from "../mixins/Kind";

export default class Button extends Kind(CustomElement as CustomHTMLElementConstructor) {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The variant of the button
             */
            variant: {
                type: ConversionTypes.String,
                value: 'outlined',
                mutable: true,
                reflect: true,
                options: ['outlined', 'text', 'contained']
            },

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