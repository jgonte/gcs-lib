import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata, { ConversionTypes } from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import SelectionContainer from "../mixins/selection-container/SelectionContainer";
import DataHolder from "../mixins/data/DataHolder";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { GenericRecord } from "../../utils/types";
import getStyle from "../../custom-element/styles/getStyle";

const defaultItemStyle = `
    list-style-type: none;
`;

export default class DataList extends
    SelectionContainer(
        DataHolder(
            CustomElement as CustomHTMLElementConstructor
        )
    ) {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the field to extract the value to display on each item
             */
            displayField: {
                attribute: 'display-field',
                type: ConversionTypes.String
            },

            /**
             * The style of each list item
             */
            itemStyle: {
                attribute: 'item-style',
                type: [
                    ConversionTypes.String, 
                    ConversionTypes.Object, 
                    ConversionTypes.Function
                ]
            },

            /**
             * The template to render the item
             */
            itemTemplate: {
                attribute: 'item-template',
                type: ConversionTypes.Function,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            }
        };
    }

    render(): NodePatchingData {

        return html`<ul>
            ${this.renderItems()}
        </ul>`;
    }

    renderItems(): NodePatchingData {

        const {
            data,
            idField
        } = this;

        return data.map((record: GenericRecord) => {

            const id = record[idField];

            return html`<li key=${id} style=${this.getItemStyle()}>
                <wcl-selectable selectable=${this.selectable} select-value=${record}>${this.renderItem(record)}</wcl-selectable>
            </li>`;
        });
    }

    getItemStyle(): string {

        const {
            itemStyle
        } = this;

        if (itemStyle === undefined) {

            return defaultItemStyle;
        }

        if (typeof itemStyle === 'string') {

            return `${defaultItemStyle} ${itemStyle}`;
        }
        else { // Assume it is an object

            return `${defaultItemStyle} ${getStyle(itemStyle)}`;
        }
    }

    renderItem(record: GenericRecord): NodePatchingData {

        const {
            displayField,
            itemTemplate
        } = this;

        if (itemTemplate === undefined) {

            return html`${record[displayField] as string}`;
        }
        else {

            return itemTemplate(record);
        }
    }
}

defineCustomElement('wcl-data-list', DataList);