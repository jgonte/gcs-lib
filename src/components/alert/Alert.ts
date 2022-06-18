import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata, { ConversionTypes } from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Kind from "../mixins/kind/Kind";
import { alertStyles } from "./Alert.styles";

export default class Alert extends
    //SizableMixin(
        Kind(
            CustomElement as CustomHTMLElementConstructor
        //)
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, alertStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * Whether to show the icon
             */
            showIcon: {
                type: ConversionTypes.Boolean,
                value: true
            },

            /**
             * What action to execute when the alert has been closed
             * If it is not defined, then the close tool will not be shown
             */
            close: {
                type: ConversionTypes.Function,
                defer: true
            }

        };
    }

    render(): NodePatchingData {

        return html`<wcl-row>
            ${this._renderIcon()}
            <slot></slot>
            ${this._renderCloseTool()}
        </wcl-row>`;
    }

    private _renderIcon(): NodePatchingData | null {

        const {
            showIcon,
            kind,
            size
        } = this;

        if (showIcon !== true) {

            return null;
        }

        return html`<wcl-icon name=${this._getIconName()} kind=${kind} size=${size}></wcl-icon>`;
    }

    private _getIconName(): string {

        switch (this.kind) {

            case "success": return "check-circle-fill";
            case "warning": return "exclamation-circle-fill";
            case "error": return "exclamation-circle-fill";
            default: return "info-circle-fill";
        }
    }

    private _renderCloseTool(): NodePatchingData | null{

        const {
            kind,
            size,
        } = this;

        if (this.close === undefined) {

            return null;
        }

        return html`<wcl-close-tool kind=${kind} size=${size} close=${evt => this.close(evt)} />`;
    }
}

defineCustomElement('wcl-alert', Alert);