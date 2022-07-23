import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";
import Nuanced from "../Nuanced";
import { toolStyles } from "./Tool.styles";

export default abstract class Tool extends Nuanced {

    static get styles(): string {

        return mergeStyles(super.styles, toolStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * What action to execute when the tool has been closed
             */
            iconName: {
                type: [
                    DataTypes.String,
                    DataTypes.Function
                ],
                defer: true,
                required: true
            }
        };
    }

    connectedCallback(): void {
        
        super.connectedCallback?.();

        this.addEventListener('click', this.click);
    }

    disconnectedCallback(): void {
        
        super.disconnectedCallback?.();

        this.removeEventListener('click', this.click);
    }

    render(): NodePatchingData {

        const {
            iconName,
        } = this;

        return html`<wcl-icon name=${typeof iconName === 'function' ? iconName() : iconName}></wcl-icon>`;
    }
}