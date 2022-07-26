import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import { DynamicObject, GenericRecord } from "../../../utils/types";
import SelectionContainer, { SelectionTypes } from "../../mixins/selection-container/SelectionContainer";
import DataCollectionHolder from "../../mixins/data/DataCollectionHolder";
import Selector from "../../selector/Selector";
import DisplayableField from "../DisplayableField";
import isPrimitive from "../../../utils/isPrimitive";

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
                required: true,
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
            selection
        } = this;

        switch (selection.length) {
            case 0: return this.renderSelectTemplate();
            case 1: return this.renderSingleSelectionTemplate(selection[0]);
            default: return this.renderMultipleSelectionTemplate(selection);
        }
    }

    renderItem(record: GenericRecord): NodePatchingData {

        const {
            itemTemplate,
            displayField
        } = this;

        if (itemTemplate !== undefined) {

            return itemTemplate(record);
        }

        return html`<wcl-selector select-value=${record}>${record[displayField] as string}</wcl-selector>`;
    }

    onSelectionChanged(selection: GenericRecord) {

        this.selection = selection;

        this.selectionChanged?.(selection);
    }

    renderContent(): NodePatchingData {

        return html`<wcl-data-list slot="content" data=${this.data} item-template=${this.renderItem} selection-changed=${this.onSelectionChanged}></wcl-data-list>`;
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

            return multipleSelectionTemplate(selection);
        }
        else {

            // Transform the data
            const data = selection.map((item: string): DynamicObject => {

                return {
                    [idField]: item[idField],
                    [displayField]: item[displayField]
                };
            });

            return html`<wcl-data-list slot="header" data=${data} id-field=${idField} display-field=${displayField} selectable="false"></wcl-data-list>`;
        }
    }

    onPropertyChanged(name: string, value: unknown) {

        super.onPropertyChanged?.(name, value);

        if (name === 'value') {

            this.selectItemWithValue(value);
        }
    }

    selectItemWithValue(value: unknown) {

        const {
            idField
        } = this;

        const selectors = (this?.shadowRoot as ShadowRoot).querySelectorAll('wcl-selector');

        const selector = Array.from(selectors).filter(c => (c as Selector).selectValue[idField] === value)[0] as Selector;

        selector.select();
    }
}

defineCustomElement('wcl-combo-box', ComboBox);