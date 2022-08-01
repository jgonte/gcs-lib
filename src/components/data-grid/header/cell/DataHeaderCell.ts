import CustomElement from "../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import getStyle from "../../../../custom-element/styles/getStyle";
import mergeStyles from "../../../../custom-element/styles/mergeStyles";
import html from "../../../../rendering/html";
import { NodePatchingData } from "../../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../../utils/data/DataTypes";
import DataGridFieldDescriptor from "../../DataGridFieldDescriptor";
import { dataHeaderCellStyles } from "./DataHeaderCell.styles";

export default class DataHeaderCell extends CustomElement {

    static get styles(): string {

        return mergeStyles(super.styles, dataHeaderCellStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The descriptor of the field to render the header cell
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
        } = this;

        if (typeof field === 'string') {

            return html`${field}`;
        }
        else {

            const {
                name,
                display
            } = field as DataGridFieldDescriptor;

            if (display !== undefined) {

                if (typeof display === 'function') {

                    return this.renderCellContainer(field, display());
                }
                else {

                    return this.renderCellContainer(field, html`<span>${display}</span>`);
                }
            }
            else {

                return this.renderCellContainer(field, html`<span>${name}</span>`);
            }
        }
    }

    renderCellContainer(field: DataGridFieldDescriptor, display: NodePatchingData): NodePatchingData {

        const {
            headerStyle
        } = field;

        if (headerStyle !== undefined) {

            const style = typeof headerStyle === 'string' ?
                headerStyle :
                getStyle(headerStyle);

            return html`<span style=${style}>${display}${this.renderSorter()}</span>`;
        }
        else {

            return html`<span>${display}${this.renderSorter()}</span>`;
        }
    }

    renderSorter(): NodePatchingData | null {

        const {
            field
        } = this;

        if (field.sortable !== true) {

            return null;
        }

        return html`<wcl-sorter-tool field=${field.name}></wcl-sorter-tool>`;
    }
}

defineCustomElement('wcl-data-header-cell', DataHeaderCell);