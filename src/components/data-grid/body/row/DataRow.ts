import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../../../custom-element/styles/mergeStyles";
import html from "../../../../rendering/html";
import { NodePatchingData } from "../../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../../utils/data/DataTypes";
import Selectable from "../../../mixins/selectable/Selectable";
import DataGridFieldDescriptor from "../../DataGridFieldDescriptor";
import { dataRowStyles } from "./DataRow.styles";

export default class DataRow
    extends Selectable(
        CustomElement as CustomHTMLElementConstructor
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, dataRowStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The descriptor of the fields to render the row
             */
            fields: {
                type: [
                    DataTypes.Array,
                    DataTypes.Function
                ],
                required: true
            },

            /**
             * The record to render the row from
             */
            record: {
                type: [
                    DataTypes.Object,
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

        return fields.map((field: string | number) =>
            html`
    <wcl-data-cell 
        field=${field} 
        record=${record} 
        key=${(field as unknown as DataGridFieldDescriptor).name || field}>
    </wcl-data-cell>`
        );
    }
}

defineCustomElement('wcl-data-row', DataRow);