import Nuanced from "../Nuanced";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { alertStyles } from "./Alert.styles";
import { DataTypes } from "../../utils/data/DataTypes";
import { closingEvent } from "../tools/close/CloseTool";

export default class Alert extends Nuanced {

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
                type: [
                    DataTypes.Function, // If the function is provided, then call it
                    DataTypes.Boolean // If true, then dispatch a closing event
                ],
                defer: true
            }
        };
    }

    render(): NodePatchingData {

        return html`
<wcl-row>
    ${this._renderIcon()}
    <slot slot="middle"></slot>
    ${this._renderCloseTool()}
</wcl-row>`;
    }

    private _renderIcon(): NodePatchingData | null {

        const {
            showIcon,
        } = this;

        if (showIcon !== true) {

            return null;
        }

        return html`
<wcl-icon 
    slot="start"
    name=${this._getIconName()}>
</wcl-icon>`;
    }

    private _getIconName(): string {

        switch (this.kind) {

            case "success": return "check-circle-fill";
            case "warning": return "exclamation-circle-fill";
            case "error": return "exclamation-circle-fill";
            default: return "info-circle-fill";
        }
    }

    private _renderCloseTool(): NodePatchingData | null {

        const {
            close
        } = this;

        if (close === undefined) {

            return null;
        }

        const handleClose: (evt: Event) => void = close === true ?
            evt => this.dispatchCustomEvent(closingEvent, {
                originalEvent: evt
            }) :
            evt => this.close(evt);

        return html`
<wcl-close-tool 
    slot="end" 
    close=${handleClose}>
</wcl-close-tool>`;
    }
}

defineCustomElement('wcl-alert', Alert);