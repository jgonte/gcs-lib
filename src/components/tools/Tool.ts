import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata, { ConversionTypes } from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Kind from "../mixins/kind/Kind";
import Sizable from "../mixins/sizable/Sizable";

export default abstract class Tool extends
    Sizable(
        Kind(
            CustomElement as CustomHTMLElementConstructor
        )
    ) {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * What action to execute when the tool has been closed
             */
            iconName: {
                type: [
                    ConversionTypes.String,
                    ConversionTypes.Function
                ],
                defer: true,
                required: true
            }
        };
    }

    render(): NodePatchingData {

        const {
            kind,
            size,
            iconName,
        } = this;

        return html`<wcl-button kind=${kind} size=${size} variant="text" click=${() => this.click()}>
            <wcl-icon name=${typeof iconName === 'function' ? iconName() : iconName}></wcl-icon>
        </wcl-button>`;
    }
}