
import defineCustomElement from "../../../custom-element/defineCustomElement";
import findChild from "../../../custom-element/mixins/helpers/findChild";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import { DynamicObject } from "../../../utils/types";
import SelectionContainer, { ISelectionContainer, SelectionTypes } from "../../mixins/selection-container/SelectionContainer";
import Selector from "../../selector/Selector";
import Field from "../Field";

interface DataItem extends ISelectionContainer {

    idField: string;

    displayField: string;
}

export default class ComboBox extends
    SelectionContainer(
        Field as unknown as CustomHTMLElementConstructor
    ) {

    // The cached container of the selector items
    private _container: DataItem | undefined = undefined;

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {
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

    render(): NodePatchingData {

        return html`<wcl-drop-down>
            <span slot="header">${this.renderHeader()}</span>
            <span slot="content">
                <slot id="content" name="content"></slot>
            </span>
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

    renderSelectTemplate(): NodePatchingData {

        const {
            selectTemplate
        } = this;

        if (selectTemplate !== undefined) {

            return selectTemplate();
        }
        else {

            return html`<wcl-localized-text intl-key="please-select">Please select</wcl-localized-text>`;
        }
    }

    renderSingleSelectionTemplate(selection: SelectionTypes): NodePatchingData {

        const {
            singleSelectionTemplate,
            _container
        } = this;

        if (singleSelectionTemplate !== undefined) {

            return singleSelectionTemplate(selection);
        }
        else {

            return html`<span>${selection[(_container as DataItem).displayField]}</span>`;
        }
    }

    renderMultipleSelectionTemplate(selection: SelectionTypes): NodePatchingData {

        const {
            multipleSelectionTemplate,
            _container
        } = this;

        if (multipleSelectionTemplate !== undefined) {

            return multipleSelectionTemplate(selection);
        }
        else {

            const {
                idField,
                displayField
            } = _container as DataItem;

            const data = selection.map((item: string): DynamicObject => {

                return {
                    [idField]: item[idField as any],
                    [displayField]: item[displayField as any]
                };
            });

            return html`<wcl-data-list data=${data} id-field=${idField} display-field=${displayField} selectable="false"></wcl-data-list>`;
        }
    }

    didMountCallback() {

        super.didMountCallback?.();

        // If the slotted content is a selection container, then attach the update header to the selectionChanged property
        const content = (this.document as ShadowRoot).getElementById('content');

        const container = findChild(
            (content as HTMLSlotElement).assignedElements({ flatten: false }) as unknown as HTMLCollection,
            (child) => (child as ISelectionContainer).isSelectionContainer === true
        ) as DataItem;

        const selectionChangedHandler = container.selectionChanged;

        if (selectionChangedHandler === undefined) {

            container.selectionChanged = (selection: SelectionTypes) => this.selection = selection;
        }
        else {

            container.selectionChanged = (selection: SelectionTypes) => {

                this.selection = selection;

                selectionChangedHandler(selection); // Include the original handler
            }
        }

        this._container = container; // Needed to reference to get idField and displayField
    }

    onPropertyChanged(name: string, value: unknown) {

        super.onPropertyChanged?.(name, value);

        if (name === 'value') {

            this.selectItemWithValue(value);
        }
    }

    selectItemWithValue(value: unknown) {

        const {
            _container
        } = this;

        const selectors = (_container?.shadowRoot as ShadowRoot).querySelectorAll('wcl-selector');

        const selector = Array.from(selectors).filter(c => (c as Selector).selectValue[(_container as DataItem).idField] === value)[0] as Selector;

        selector.select();
    }
}

defineCustomElement('wcl-combo-box', ComboBox);