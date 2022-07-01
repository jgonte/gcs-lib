import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import { inputEvent } from "../../fields/Field";
import Sizable from "../../mixins/sizable/Sizable";
import { validationEvent } from "../../mixins/validatable/Validatable";
import { formFieldStyles } from "./FormField.styles";
import labelWidth from "../labelWidth";
import css from "../../../custom-element/styles/css";
import labelAlign from "../labelAlign";

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
             * Whether the form field is required
             * If true it sets a field indicator as required and adds a required validator to the field
             */
            required: {
                type: DataTypes.Boolean,
                reflect: true,
                value: false
            },

            /**
             * The width of the labels of the form
             */
            labelWidth,

            /**
             * Label alignment
             */
             labelAlign,

            /**
             * The key to retrieve a localized help value from an i18n provider
             */
            helpResourceKey: {
                attribute: 'help-resource-key',
                type: DataTypes.String
            },

            /**
             * The help content
             */
            help: {
                type: DataTypes.String
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
            labelWidth,
            labelAlign,
            required,
            helpResourceKey,
            help,
            modified,
            warnings,
            errors
        } = this;

        const formLabelWidth = css`width: ${labelWidth}; min-width: ${labelWidth};`;

        return html`<wcl-row id="form-field-row">    
            <wcl-form-label 
                required=${required}
                help-resource-key=${helpResourceKey}
                help=${help}
                modified=${modified}
                label-align=${labelAlign} 
                style=${formLabelWidth}>
                    <span slot="label">
                        <slot name="label"></slot>
                    </span>
                    <slot name="tools"></slot>   
            </wcl-form-label>            
            <slot name="field"></slot>      
        </wcl-row>
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