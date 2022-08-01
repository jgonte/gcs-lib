import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import mergeStyles from "../../../../custom-element/styles/mergeStyles";
import html from "../../../../rendering/html";
import { NodePatchingData } from "../../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../../utils/data/DataTypes";
import { dataCellStyles } from "./DataCell.styles";

export default class DataCell extends CustomElement {

    static get styles(): string {

        return mergeStyles(super.styles, dataCellStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The record to render the cell from
             */
            record: {
                type: [
                    DataTypes.Object, 
                    DataTypes.Function
                ],
                required: true
            },

            /**
             * The descriptor of the field to render the cell
             */
            field: {
                type: [
                    DataTypes.Object, 
                    DataTypes.Function, 
                    DataTypes.String
                ],
                required: true
            }
        };
    }

    render(): NodePatchingData {

        const {
            field,
            record
        } = this;

        const name = typeof field === 'string' ?
            field :
            field.name;

        if (field.render !== undefined) {

            return field.render(record, field);
        }
        else {

            return html`${record[name]}`;
        }   
    }
}

defineCustomElement('wcl-data-cell', DataCell);