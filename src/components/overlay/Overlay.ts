import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { overlayStyles } from "./Overlay.styles";

export default class Overlay extends CustomElement {

    static get styles(): string {

        return overlayStyles;
    }

    render(): NodePatchingData {

        return html`<slot></slot>`;
    }
}

defineCustomElement('wcl-overlay', Overlay);