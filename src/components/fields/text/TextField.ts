import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import DisplayableField from "../DisplayableField";

export default class TextField extends DisplayableField {

    render(): NodePatchingData {

        const {
            name,
            value,
            //required,
            disabled
        } = this;

        return html`<input
            type="text"
            name=${name}
            value=${value}
            onInput=${event => this.handleInput(event)}
            onChange=${event => this.handleChange(event)}
            onBlur=${() => this.handleBlur()}
            disabled=${disabled}
        />`;
    }
}

defineCustomElement('wcl-text-field', TextField);