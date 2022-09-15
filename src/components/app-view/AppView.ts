import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { appViewStyles } from "./AppView.styles";

export default class AppView extends CustomElement {

    static get styles(): string {

        return mergeStyles(super.styles, appViewStyles);
    }

    render(): NodePatchingData {

        return html`
<div id="header">
    <slot name="header"></slot>
</div>
<div id="subheader">
    <slot name="subheader"></slot>
</div>
<div id="left">
    <slot name="left"></slot>
</div>
<div id="center" >
    <slot name="center"></slot>
</div>
<div id="right">
    <slot name="right"></slot>
</div>
<div id="footer"> 
    <slot name="footer"></slot>
</div>`;
    }
}

defineCustomElement('wcl-app-view', AppView);