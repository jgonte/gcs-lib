import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import DisplayableField from "../DisplayableField";

function formatDate(value: Date | string) {

    const d = typeof value === 'string' ?
        value :
        value.toISOString(); // Assume a Date

    const i = d.indexOf('T');

    return d.substring(0, i); // Extract the date part only
}

export default class DateField extends DisplayableField {

    static getFieldType(): DataTypes {

        return DataTypes.Date;
    }

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