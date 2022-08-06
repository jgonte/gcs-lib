import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import Sizable from "../../mixins/sizable/Sizable";
import { validationEvent } from "../../mixins/validatable/Validatable";
import { formFieldStyles } from "./FormField.styles";
import css from "../../../custom-element/styles/css";
import labelAlign from "../labelAlign";
import labelWidth from "../labelWidth";
import { inputEvent } from "../../fields/DisplayableField";

export default class FormField extends
    Sizable(
        CustomElement as CustomHTMLElementConstructor
    )
{

    static get styles(): string {

        return mergeStyles(super.styles, formFieldStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The alignment of the label
             */
            labelAlign,

            /**
             * The width of the labels of the form
             */
            labelWidth,

            /** 
             * Whether the form field is required
             * If true it sets a field indicator as required and adds a required validator to the field
             */
            required: {
                type: DataTypes.Boolean,
                reflect: true,
                value: false
            }
        };
    }

    static get state(): Record<string, CustomElementStateMetadata> {

        return {

            /**
             * Whether the field has been modified (Its value differs from the initial/loaded one)
             */
            modified: {
                value: false
            },

            warnings: {
                value: []
            },

            errors: {
                value: []
            }
        };
    }

    render(): NodePatchingData {

        const {
            labelAlign,
            labelWidth,
            required,
            modified,
            warnings,
            errors
        } = this;

        const labelContainerStyle = css`width: ${labelWidth};`;

        const labelStyle = css`text-align: ${labelAlign};`;

        return html`
<div id="labeled-field">
    <span id="label-container" style=${labelContainerStyle}>
        <span id="label" style=${labelStyle}>
            <slot name="label"></slot>
        </span> 
        <span id="tools">
            <slot name="tools" id="tools-slot">        
            </slot>
            ${required === true ?
                html`<wcl-required-tip></wcl-required-tip>`
                : null}
            <span id="colon-span">:</span>
        </span>
    </span>
    <span id="field">
        <slot name="field"></slot>
            ${modified === true ?
                html`<wcl-modified-tip></wcl-modified-tip>`
                : null}
    </span>
</div>      
<wcl-validation-summary
    warnings=${warnings} 
    errors=${errors}>
</wcl-validation-summary>`;
    }

    connectedCallback() {

        super.connectedCallback?.();

        this.addEventListener(inputEvent, this.handleInput as EventListenerOrEventListenerObject);

        this.addEventListener(validationEvent, this.handleValidation as EventListenerOrEventListenerObject);
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        this.removeEventListener(inputEvent, this.handleInput as EventListenerOrEventListenerObject);

        this.removeEventListener(validationEvent, this.handleValidation as EventListenerOrEventListenerObject);
    }

    handleInput(event: CustomEvent): void {

        const {
            modified
        } = event.detail;

        this.modified = modified;

        event.stopPropagation();
    }

    handleValidation(event: CustomEvent): void {

        const {
            warnings,
            errors
        } = event.detail;

        this.warnings = warnings;

        this.errors = errors;

        event.stopPropagation();
    }
}

defineCustomElement('wcl-form-field', FormField);