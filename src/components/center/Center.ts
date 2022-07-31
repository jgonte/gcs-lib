import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { centerStyles } from "./Center.styles";

export default class Center extends CustomElement {

    static get styles(): string {

        return mergeStyles(super.styles, centerStyles);
    }

    render(): NodePatchingData {

        return html`<slot></slot>`;
    }
}

defineCustomElement('wcl-center', Center);