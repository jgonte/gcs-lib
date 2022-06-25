import CustomElementPropertyMetadata, { ConversionTypes } from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { selectionChangedEvent } from "../selectable/Selectable";

export type SelectionTypes = Array<string> & { [x: string]: string };

export interface ISelectionContainer extends HTMLElement {
    isSelectionContainer: boolean;

    selectionChanged?: (selection: SelectionTypes) => void;
}

/**
 * Notifies the container when one of the selection in the children has changed
 */
export default function SelectionContainer<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class SelectionContainerMixin extends Base implements ISelectionContainer {

        isSelectionContainer = true; // Mark the instance as a selection 

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * Whether the component is selectable
                 */
                selectable: {
                    type: ConversionTypes.Boolean,
                    value: true,
                    reflect: true,
                    //inherit: true
                },

                /**
                 * Whether we can process multiple selection (false by default)
                 */
                multiple: {
                    type: ConversionTypes.Boolean,
                    reflect: true
                },

                /**
                 * The selected item or items. It is an attribute since it can be passed through a property initially
                 */
                selection: {
                    type: ConversionTypes.Array,
                    value: [],
                    reflect: true
                },

                /**
                 * The handler to call when the selection has changed
                 */
                selectionChanged: {
                    attribute: 'selection-changed',
                    type: ConversionTypes.Function,
                    defer: true
                }
            };
        }

        static get state(): Record<string, CustomElementStateMetadata> {

            return {

                /**
                 * To track the current selected child for a single selection model
                 */
                selectedChild: {
                    value: undefined
                }
            };
        }

        // The mixin constructor requires the parameters signature to be of type any
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        constructor(...args: any[]) {

            super(args);

            this.updateSelection = this.updateSelection.bind(this);
        }

        attributeChangedCallback(attributeName: string, oldValue: string, newValue: string) {

            super.attributeChangedCallback?.(attributeName, oldValue, newValue);

            if (attributeName === "selectable") {

                if (newValue === "true" || newValue === "") {

                    this.addEventListener(selectionChangedEvent, this.updateSelection as EventListenerOrEventListenerObject);
                }
                else { // newValue === "false"

                    this.removeEventListener(selectionChangedEvent, this.updateSelection as EventListenerOrEventListenerObject);
                }
            }
        }

        updateSelection(event: CustomEvent) {

            event.stopPropagation();

            const {
                multiple,
                selection,
                selectionChanged
            } = this;

            const {
                element,
                selected,
                value
            } = event.detail;

            if (multiple !== undefined) {

                if (selected === true) { // Add the value to the selection

                    this.selection = [...selection, value];
                }
                else { // Remove the value from the selection

                    this.selection = selection.filter((item: { id: unknown; }) => item.id !== value.id);
                }
            }
            else { // Replace the old selection with the new one

                const {
                    selectedChild
                } = this;

                // Deselect previous selected child
                if (selectedChild !== undefined) {

                    selectedChild.selected = false;
                }

                this.selection.length = 0; // Clear the selection

                if (selected === true) {

                    this.selection.push(value);

                    this.selectedChild = element;
                }
                else {

                    this.selectedChild = undefined;
                }
            }

            if (selectionChanged !== undefined) {

                selectionChanged(this.selection);
            }
        }
    }
}
