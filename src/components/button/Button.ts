import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Disableable from "../mixins/disableable/Disableable";
import Sizable from "../mixins/sizable/Sizable";
import Variant from "../mixins/variant/Variant";
import Kind from "../mixins/kind/Kind";
import { buttonStyles } from "./Button.styles";
import { DataTypes } from "../../utils/data/DataTypes";

export default class Button extends
    Disableable(
        Sizable(
            Variant(
                Kind(
                    CustomElement as CustomHTMLElementConstructor
                )
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
                type: DataTypes.Function,
                defer: true
            }
        };
    }

    render(): NodePatchingData | NodePatchingData[] | null {

        const {
            disabled,
            click
        } = this;

        return html`<button disabled=${disabled} onClick=${click}>
            <slot></slot>
        </button>`;
    }

}

defineCustomElement('wcl-button', Button);