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
            labelWidth: {
                attribute: 'label-width',
                type: DataTypes.String,
                reflect: true,
                inherit: true
            },

            /**
             * Content justification
             */
            justifyLabelContent: {
                attribute: 'justify-label-content',
                type: DataTypes.String,
                value: 'space-evenly',
                options: ['start', 'center', 'space-around', 'space-between', 'space-evenly'],
                reflect: true,
                inherit: true
            },

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
            justifyLabelContent,
            required,
            helpResourceKey,
            help,
            modified,
            warnings,
            errors
        } = this;

        const formLabelWidth = `width: ${labelWidth};`;

        return html`<wcl-row id="field-row" justify-content="start">    
            <wcl-form-label 
                required=${required}
                help-resource-key=${helpResourceKey}
                help=${help}
                modified=${modified}
                justify-content=${justifyLabelContent} 
                style=${formLabelWidth}>
                    <span slot="label">
                        <slot name="label"></slot>
                    </span>
                    <wcl-row slot="tools" justify-content="space-evenly">
                        <slot name="tools"></slot>
                    </wcl-row>
            </wcl-form-label>           
            <span>:</span>
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