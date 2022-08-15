import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";
import { GenericRecord } from "../../utils/types";
import DataCollectionHolder from "../mixins/data/DataCollectionHolder";
import { dataGridStyles } from "./DataGrid.styles";
import mergeStyles from "../../custom-element/styles/mergeStyles";

export default class DataGrid extends
    DataCollectionHolder(
        CustomElement as CustomHTMLElementConstructor
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, dataGridStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The descriptor of the fields to render each row
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

    render(): NodePatchingData {

        return html`
<wcl-panel>
    ${this.renderHeader()}
    ${this.renderBody()}      
</wcl-panel>`;
    }

    renderHeader(): NodePatchingData {

        return html`
<wcl-data-header
    slot="header"
    fields=${this.fields}>
</wcl-data-header>`;
    }

    renderBody(): NodePatchingData[] {

        const {
            fields,
            data,
            idField
        } = this;

        return data.map((record: GenericRecord) =>
            html`
<wcl-data-row 
    slot="body"
    fields=${fields}
    record=${record} 
    key=${record[idField]}>
</wcl-data-row>`
        );
    }
}

defineCustomElement('wcl-data-grid', DataGrid);