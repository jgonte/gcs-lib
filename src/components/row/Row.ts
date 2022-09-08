import CustomElement from "../../custom-element/CustomElement";
import { rowStyles } from "./Row.styles";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import html from "../../rendering/html";
import defineCustomElement from "../../custom-element/defineCustomElement";

/**
 * A line component with three regions to layout the children
 */
export default class Row extends CustomElement {

    static get styles(): string {

        return mergeStyles(super.styles, rowStyles);
    }

    render(): NodePatchingData {

        return html`
<slot name="start"></slot>
<slot name="middle"></slot>
<slot name="end"></slot>`;
    }
}

defineCustomElement('wcl-row', Row);