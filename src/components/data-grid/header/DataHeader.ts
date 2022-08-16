import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import DataGridFieldDescriptor from "../DataGridFieldDescriptor";
import { dataHeaderStyles } from "./DataHeader.styles";

export default class DataHeader extends CustomElement {

    static get styles(): string {

        return mergeStyles(super.styles, dataHeaderStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The descriptor of the fields to render the header
             */
            fields: {
                type: [
                    DataTypes.Array, 
                    DataTypes.Function
                ],
                required: true
            }
        };
    }

    render(): NodePatchingData[] {

        return this.fields.map((field: DataGridFieldDescriptor |string | number) => {

            return html`<wcl-data-header-cell field=${field} key=${(field as DataGridFieldDescriptor).name || field}></wcl-data-header-cell>`;
        });
    }
}

defineCustomElement('wcl-data-header', DataHeader);