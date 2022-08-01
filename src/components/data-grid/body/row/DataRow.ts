import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import mergeStyles from "../../../../custom-element/styles/mergeStyles";
import html from "../../../../rendering/html";
import { NodePatchingData } from "../../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../../utils/data/DataTypes";
import { dataRowStyles } from "./DataRow.styles";

export default class DataRow extends CustomElement {

    static get styles(): string {

        return mergeStyles(super.styles, dataRowStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The record to render the row from
             */
            record: {
                type: [
                    DataTypes.Object, 
                    DataTypes.Function
                ],
                required: true
            },

            /**
             * The descriptor of the fields to render the row
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

        const {
            record,
            fields
        } = this;

        return fields.map((field: string | number) => html`<wcl-data-cell field=${field} record=${record} key=${field}></wcl-data-cell>`);
    }
}

defineCustomElement('wcl-data-row', DataRow);