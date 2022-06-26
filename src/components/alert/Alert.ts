import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Sizable from "../mixins/sizable/Sizable";
import Kind from "../mixins/kind/Kind";
import { alertStyles } from "./Alert.styles";
import { DataTypes } from "../../utils/data/DataTypes";

export default class Alert extends
    Sizable(
        Kind(
            CustomElement as CustomHTMLElementConstructor
        )
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
                type: DataTypes.Boolean,
                value: true
            },

            /**
             * What action to execute when the alert has been closed
             * If it is not defined, then the close tool will not be shown
             */
            close: {
                type: DataTypes.Function,
                defer: true
            }

        };
    }

    render(): NodePatchingData {

        return html`${this._renderIcon()}
            <slot></slot>
            ${this._renderCloseTool()}`;
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

    private _renderCloseTool(): NodePatchingData {

        const {
            kind,
            size,
        } = this;

        if (this.close === undefined) {

            return html`<span></span>`; // Create an empty element so the slotted content stays centered
        }

        return html`<wcl-close-tool kind=${kind} size=${size} close=${evt => this.close(evt)} />`;
    }
}

defineCustomElement('wcl-alert', Alert);