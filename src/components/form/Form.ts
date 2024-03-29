import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { ValidationContext } from "../../utils/validation/validators/Validator";
import Field, { fieldAddedEvent, changeEvent } from "../fields/Field";
import Sizable from "../mixins/sizable/Sizable";
import Submittable from "../mixins/data/Submittable";
import Validatable from "../mixins/validatable/Validatable";
import Loadable from "../mixins/data/Loadable";
import Errorable from "../mixins/errorable/Errorable";
import { formStyles } from "./Form.styles";
import { DynamicObject, GenericRecord } from "../../utils/types";
import labelWidth from "./labelWidth";
import labelAlign from "./labelAlign";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";

export default class Form extends
    Sizable(
        Submittable(
            Validatable(
                Loadable(
                    Errorable(
                        CustomElement as CustomHTMLElementConstructor
                    )
                )
            )
        )
    ) {

    private _fields: Map<string, Field> = new Map<string, Field>();

    modifiedFields: Set<Field> = new Set<Field>();

    constructor() {

        super();

        this.handleFieldAdded = this.handleFieldAdded.bind(this);

        this.handleChange = this.handleChange.bind(this);

        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
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

        // They are not used but help to assert their intent
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
           <wcl-localized-text intl-key="submit">Submit</wcl-localized-text>
           <wcl-icon name="box-arrow-right"></wcl-icon>
        </wcl-button>`;
    }

    getSubmitData(): DynamicObject {

        const data = this.getData();

        console.log(JSON.stringify(data));

        return data;
    }

    submit(): void {

        if (this.modifiedFields.size === 0) {

            this.error = 'This form has not been modified';

            return;
        }

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

        this.setData((data.payload ?? data) as DynamicObject, true); // Set the fields as not being changed
    }

    /**
     * Called when a response from a submission is received from a server
     * @param data The data returned by the server
     */
    handleSubmitResponse(data: GenericRecord) {

        console.log(JSON.stringify(data));

        const d = data.payload ?? data;

        this.setData(d as DynamicObject, true); // Set the fields as not being changed
    }

    setData(data: DynamicObject, acceptChanges: boolean = false): void {

        console.log(JSON.stringify(data));

        for (const key in data) {

            if (data.hasOwnProperty(key)) {

                const field = this._fields.get(key);

                if (field !== undefined) {

                    const value = data[key];

                    field.value = value; // Here beforeValueSet will be called to transform the value if needed

                    if (acceptChanges === true) {

                        field.acceptChanges();
                    }
                }
                else { // The field does not need to exist for the given data member but let the programmer know it is missing

                    console.warn(`Field of name: '${key}' was not found for data member with same name`);
                }
            }
        }
    }

    /**
     * Retrieves the record from the form
     * @returns 
     */
    getData(): DynamicObject {

        const data: DynamicObject = {};

        for (const [key, field] of this._fields) {

            const value = field.serializeValue !== undefined ?
                field.serializeValue() :
                field.value;

            if (!isUndefinedOrNull(value)) {

                data[key] = value;
            }
        }

        return data;
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

        window.addEventListener('beforeunload', this.handleBeforeUnload);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener(fieldAddedEvent, this.handleFieldAdded as EventListenerOrEventListenerObject);

        this.removeEventListener(changeEvent, this.handleChange as EventListenerOrEventListenerObject);

        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }

    handleBeforeUnload(evt: Event): boolean {

        if (this.modifiedFields.size > 0) {

            evt.preventDefault();

            return evt.returnValue = true;
        }

        return evt.returnValue = false;
    }

    handleFieldAdded(event: CustomEvent): void {

        event.stopPropagation();

        const {
            field
        } = event.detail;

        this._fields.set(field.name, field); // Add the field to the form   
    }

    handleChange(event: CustomEvent): void {

        event.stopPropagation();

        const {
            name,
            newValue
        } = event.detail;

        console.log('valueChanged: ' + JSON.stringify(event.detail));

        this.setData({
            [name]: newValue
        });
    }
}

defineCustomElement('wcl-form', Form);