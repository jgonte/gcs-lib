import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import Field from "../Field";

function formatDate(value: string) {

    const i = value.indexOf('T');

    return value.substring(0, i); // Extract the date part only
}

export default class DateField extends Field {

    render(): NodePatchingData {

        const {
            name,
            value,
            //required,
            disabled
        } = this;

        return html`<input
            type="date"
            name=${name}
            value=${value !== undefined ? formatDate(value) : undefined}
            onInput=${event => this.handleInput(event)}
            onChange=${event => this.handleChange(event)}
            onBlur=${() => this.handleBlur()}
            disabled=${disabled}
        />`;
    }
}

defineCustomElement('wcl-date-field', DateField);