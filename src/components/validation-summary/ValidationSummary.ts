import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata, { ConversionTypes } from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";

export default class ValidationSummary extends CustomElement {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /** 
             * The warnings to display
             */
            warnings: {
                type: ConversionTypes.Array,
                value: []
            },

            /**
             * The errors to display
             */
            errors: {
                type: ConversionTypes.Array,
                value: []
            }
        };
    }

    render(): NodePatchingData {

        return html`${this.renderWarnings()}
            ${this.renderErrors()}`;
    }

    renderWarnings() {

        const {
            warnings
        } = this;

        if (warnings === undefined) {

            return null;
        }

        return warnings.map((warning: string) => html`<wcl-alert kind="warning">${warning}</wcl-alert>`);
    }

    renderErrors() {

        const {
            errors
        } = this;

        if (errors === undefined) {

            return null;
        }

        return errors.map((error: string) => html`<wcl-alert kind="danger">${error}</wcl-alert>`);
    }
}

defineCustomElement('wcl-validation-summary', ValidationSummary);