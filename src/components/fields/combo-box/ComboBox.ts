import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import { DynamicObject, GenericRecord } from "../../../utils/types";
import SelectionContainer, { SelectionTypes } from "../../mixins/selection-container/SelectionContainer";
import DataCollectionHolder from "../../mixins/data/DataCollectionHolder";
import DisplayableField from "../DisplayableField";
import isPrimitive from "../../../utils/isPrimitive";
import CustomElement from "../../../custom-element/CustomElement";

export default class ComboBox extends
    SelectionContainer(
        DataCollectionHolder(
            DisplayableField as unknown as CustomHTMLElementConstructor
        )
    ) {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the field that contains the ID of the record
             */
            idField: {
                attribute: 'id-field',
                type: DataTypes.String,
                required: true
            },

            /**
             * The name of the field that contains the field of the record to display in the selection
             */
            displayField: {
                attribute: 'display-field',
                type: DataTypes.String,
                required: true
            },

            /**
             * The template to render the item (record) in the (data) list
             */
            itemTemplate: {
                attribute: 'item-template',
                type: DataTypes.Function,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            },

            /**
             * The template to render the header of the combo box
             */
            headerTemplate: {
                attribute: 'header-template',
                type: DataTypes.Function,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            },

            /**
             * The template to render the select text
             */
            selectTemplate: {
                attribute: 'select-template',
                type: DataTypes.Function,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            },

            /**
             * The template to render the select text
             */
            singleSelectionTemplate: {
                attribute: 'single-selection-template',
                type: DataTypes.Function,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            },

            /**
             * The template to render the select text
             */
            multipleSelectionTemplate: {
                attribute: 'multiple-selection-template',
                type: DataTypes.Function,
                defer: true // Store the function itself instead of executing it to get its return value when initializing the property
            }
        };
    }

    constructor() {

        super();

        this.renderItem = this.renderItem.bind(this);

        this.onSelectionChanged = this.onSelectionChanged.bind(this);
    }

    render(): NodePatchingData {

        return html`<wcl-drop-down>
            ${this.renderHeader()}
            ${this.renderContent()}
        </wcl-drop-down>`;
    }

    renderHeader(): NodePatchingData {

        const {
            selection,
            multiple
        } = this;

        if (selection.length === 0) {

            return this.renderSelectTemplate(); // No selection
        }
        else {

            if (multiple === true) {

                return this.renderMultipleSelectionTemplate(selection);
            }
            else {

                return this.renderSingleSelectionTemplate(selection[0]);
            }
        }
    }

    renderItem(record: GenericRecord): NodePatchingData {

        const {
            itemTemplate,
            displayField
        } = this;

        const display = itemTemplate !== undefined ?
            itemTemplate(record) :
            record[displayField];

        return html`<wcl-selector select-value=${record}>${display}</wcl-selector>`;
    }

    onSelectionChanged(selection: GenericRecord, selectedChildren: CustomElement[]) {

        this.selection = selection;

        this.selectedChildren = selectedChildren;

        this.selectionChanged?.(selection, selectedChildren);
    }

    renderContent(): NodePatchingData {

        const {
            data,
            renderItem,
            multiple,
            idField,
            onSelectionChanged
        } = this;

        if (data?.length > 0) { // There are records

            return html`
<wcl-data-list 
    slot="content" 
    data=${data} 
    item-template=${renderItem} 
    initialized=${dataList => this.content = dataList}
    multiple=${multiple}
    id-field=${idField} 
    selection-changed=${onSelectionChanged}>
</wcl-data-list>`;
        }
        else {

            this.content = null;

            return html`
<wcl-alert 
    slot="content"
    kind="warning">
    <wcl-localized-text resource-key="noDataAvailable">No Data Available</wcl-localized-text>
</wcl-alert>`;
        }
    }

    renderSelectTemplate(): NodePatchingData {

        const {
            selectTemplate
        } = this;

        if (selectTemplate !== undefined) {

            return selectTemplate();
        }
        else {

            return html`<wcl-localized-text slot="header" intl-key="please-select">Please select</wcl-localized-text>`;
        }
    }

    renderSingleSelectionTemplate(selection: SelectionTypes): NodePatchingData {

        const {
            singleSelectionTemplate,
            displayField
        } = this;

        if (singleSelectionTemplate !== undefined) {

            return singleSelectionTemplate(selection);
        }
        else {

            const value = isPrimitive(selection) ?
                selection :
                selection[displayField];

            return html`<span slot="header">${value}</span>`;
        }
    }

    renderMultipleSelectionTemplate(selection: SelectionTypes): NodePatchingData {

        const {
            multipleSelectionTemplate,
            idField,
            displayField
        } = this;


        if (multipleSelectionTemplate !== undefined) {

            return multipleSelectionTemplate(selection, this.deselectById);
        }
        else {

            // Transform the data
            const data = selection.map((item: string): DynamicObject => {

                return {
                    [idField]: item[idField],
                    [displayField]: item[displayField]
                };
            });

            const itemTemplate = (record: DynamicObject) => html`
<wcl-pill kind="primary" variant="contained">
    ${record[displayField] as string}
    <wcl-close-tool close=${() => this.deselectById(record[idField])}></wcl-close-tool>
</wcl-pill>`;

            return html`
<wcl-data-list
    slot="header" 
    style="display: flex; flex-wrap: wrap; max-width: 500px; border: solid 1px black;" 
    data=${data} 
    item-template=${itemTemplate}>
</wcl-data-list>`;
        }
    }

    onPropertyChanged(name: string, value: unknown) {

        super.onPropertyChanged?.(name, value);

        if (name === 'value') {

            this.content.selectByValue(value);
        }
    }
}

defineCustomElement('wcl-combo-box', ComboBox);