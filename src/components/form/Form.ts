import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import DataRecord from "../../utils/data/record/DataRecord";
import { ValidationContext } from "../../utils/validation/validators/Validator";
import Field, { fieldAddedEvent, changeEvent } from "../fields/Field";
import Submittable from "../mixins/data/Submittable";
import Validatable from "../mixins/validatable/Validatable";
import Loadable from "../mixins/data/Loadable";
import Errorable from "../mixins/errorable/Errorable";
import { formStyles } from "./Form.styles";
import { DynamicObject, GenericRecord } from "../../utils/types";
import labelWidth from "./labelWidth";
import labelAlign from "./labelAlign";

export default class Form extends
    Submittable(
        Validatable(
            Loadable(
                Errorable(
                    CustomElement as CustomHTMLElementConstructor
                )
            )
        )
    ) {

    private _fields: Map<string, Field> = new Map<string, Field>();

    private _record: DataRecord = new DataRecord();

    constructor() {

        super();

        this.handleFieldAdded = this.handleFieldAdded.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    static get styles(): string {

        return formStyles;
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The width of the labels of the form
             */
            labelWidth,

            /**
             * Label alignment
             */
            labelAlign
        };
    }

    render(): NodePatchingData {

        const {
            labelWidth,
            labelAlign
        } = this;

        return html`<form>
            ${this.renderLoading()}
            ${this.renderSubmitting()}
            ${this.renderError()}
            <slot label-width=${labelWidth} label-align=${labelAlign} key="form-fields"></slot>
            ${this._renderButton()}
        </form>`;
    }

    private _renderButton(): NodePatchingData {

        // Doing onClick=${this.submit} binds the button instead of the form to the submit function
        return html`<wcl-button key="submit-button" kind="primary" variant="contained" click=${() => this.submit()}>
           <wcl-localized-text resource-key="submit">Submit</wcl-localized-text>
           <wcl-icon name="box-arrow-right"></wcl-icon>
        </wcl-button>`;
    }

    getSubmitData() {

        const data = this._record.getData();

        console.log(JSON.stringify(data));

        return data;
    }

    submit() {

        if (this.validate()) {

            super.submit();
        }
    }

    createValidationContext(): ValidationContext {

        return {
            warnings: [],
            errors: []
        }
    }

    /**
     * Handles the data that was loaded from the server
     * @param data The data returned by the server
     */
    handleLoadedData(data: GenericRecord) {

        console.log(JSON.stringify(data));

        const d = data.payload ?? data;

        this._record.setData(d as DynamicObject, true); // Fill the record without seting any modified fields

        this._populateFields(d as DynamicObject); // Update the form with the returned values
    }

    /**
     * Called when a response from a submission is received from a server
     * @param data The data returned by the server
     */
    handleSubmitResponse(data: GenericRecord) {

        console.log(JSON.stringify(data));

        const d = data.payload ?? data;

        this._record.setData(d as DynamicObject, true); // Fill the record without seting any modified fields

        this._populateFields(d as DynamicObject); // Update the form with the returned values
    }

    private _populateFields(data: GenericRecord) {

        for (const key in data) {

            if (data.hasOwnProperty(key)) {

                const field = this._fields.get(key);

                if (field !== undefined) {

                    field.value = data[key];
                }
                else { // The field does not need to exist for the given data member but let the programmer know it is missing

                    console.warn(`Field of name: '${key}' was not found for data member with same name`);
                }
            }
        }
    }

    initializeValidator(validator: string) {

        switch (validator) {

            default: throw new Error(`initializeValidator is not implemented for validator: '${validator}'`);
        }
    }

    validate(): boolean {

        let valid = super.validate();

        this._fields.forEach(field => {

            const v = field.validate();

            if (valid === true) {

                valid = v;
            }
        });

        return valid;
    }

    connectedCallback() {

        super.connectedCallback?.();

        this.addEventListener(fieldAddedEvent, this.handleFieldAdded as EventListenerOrEventListenerObject);

        this.addEventListener(changeEvent, this.handleChange as EventListenerOrEventListenerObject);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener(fieldAddedEvent, this.handleFieldAdded as EventListenerOrEventListenerObject);

        this.removeEventListener(changeEvent, this.handleChange as EventListenerOrEventListenerObject);
    }

    handleFieldAdded(event: CustomEvent): void {

        const {
            field
        } = event.detail;

        const {
            name,
            dataField
        } = field;

        this._fields.set(name, field); // Add the field to the form

        this._record.setField(name, dataField);

        event.stopPropagation();
    }

    handleChange(event: CustomEvent): void {

        const {
            name,
            newValue
        } = event.detail;

        console.log('valueChanged: ' + JSON.stringify(event.detail));

        this._record.setData({
            [name]: newValue
        });

        event.stopPropagation();
    }
}

defineCustomElement('wcl-form', Form);