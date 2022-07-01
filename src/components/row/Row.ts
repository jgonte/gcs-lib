import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";
import { rowStyles } from "./Row.styles";

export default class Row extends CustomElement {

    static get styles(): string {

        return rowStyles;
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * Content justification
             */
            justifyContent: {
                attribute: 'justify-content',
                type: DataTypes.String,
                value: 'space-between',
                options: ['start', 'center', 'end', 'space-around', 'space-between', 'space-evenly'],
                reflect: true
            }
        };
    }

    render(): NodePatchingData {

        return html`<slot></slot>`;
    }
}

defineCustomElement('wcl-row', Row);