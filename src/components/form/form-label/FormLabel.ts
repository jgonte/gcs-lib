import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import css from "../../../custom-element/styles/css";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import labelAlign from "../labelAlign";
import { formLabelStyles } from "./FormLabel.styles";

export default class FormLabel extends CustomElement {

    static get styles(): string {

        return formLabelStyles;
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
             * Whether the form field is modified to show it on the label
             */
            modified: {
                type: DataTypes.Boolean,
                reflect: true,
                value: false
            },

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

    render(): NodePatchingData {

        const {
            required,
            helpResourceKey,
            help,
            modified,
            labelAlign
        } = this;

        const labelWrapperStyle = css`display: inline-block; text-align: ${labelAlign}; width: calc(100% - 80px);`;

        return html`<wcl-row justify-content="space-between">
            <span style=${labelWrapperStyle}>
                <slot name="label"></slot> 
            </span>   
            <wcl-row justify-content="end">
                ${helpResourceKey !== undefined || help !== undefined ?
                    html`<wcl-tool-tip>
                        <wcl-badge kind="primary" slot="trigger">?</wcl-badge>
                        <wcl-localized-text resource-key=${helpResourceKey} slot="content">${help || ''}</wcl-localized-text>
                    </wcl-tool-tip>`
                    : null}   
                ${required === true ?
                    html`<wcl-tool-tip>
                        <wcl-badge kind="danger" slot="trigger">*</wcl-badge>
                        <wcl-localized-text resource-key="thisFieldIsRequired" slot="content">This field is required</wcl-localized-text>
                    </wcl-tool-tip>`
                    : null}     
                ${modified === true ?
                    html`<wcl-tool-tip>
                        <wcl-badge kind="primary" slot="trigger">M</wcl-badge>
                        <wcl-localized-text resource-key="thisFieldHasBeenModified" slot="content">This field has been modified</wcl-localized-text>
                    </wcl-tool-tip>`
                    : null}
                <slot name="tools" id="tools-slot"></slot>
                <span id="colon-span">:</span> 
            </wcl-row>  
        </wcl-row>`;
    }
}

defineCustomElement('wcl-form-label', FormLabel);