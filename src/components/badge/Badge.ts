import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Kind from "../mixins/kind/Kind";
import { badgeStyles } from "./Badge.styles";

export default class Badge extends
    Kind(
        CustomElement as CustomHTMLElementConstructor
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, badgeStyles);
    }

    render(): NodePatchingData {

        return html`<slot></slot>`;
    }
}

defineCustomElement('wcl-badge', Badge);