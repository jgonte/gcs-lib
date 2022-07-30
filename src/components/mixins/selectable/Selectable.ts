import CustomElement from "../../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import { DataTypes } from "../../../utils/data/DataTypes";
import Hoverable from "../hoverable/Hoverable";
import { selectableStyles } from "./Selectable.styles";

export const selectionChangedEvent = 'selectionChanged';

/**
 * Allows a component to be selected when clicked
 */
export default function Selectable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class SelectableMixin extends Hoverable( // Selectable items are also hoverable by default
        Base
    ) {

        static get styles(): string {

            return mergeStyles(super.styles, selectableStyles);
        }

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * Whether the component is selectable
                 */
                selectable: {
                    type: DataTypes.Boolean,
                    value: true,
                    reflect: true,
                    inherit: true
                },

                /**
                 * Whether the item is selected
                 */
                selected: {
                    type: DataTypes.Boolean,
                    reflect: true,
                    // Do not use arrow function below so the right "this" binding happens
                    canChange: function() {

                        return (this as unknown as SelectableMixin).selectable === true;
                    },
                    change: function(value: unknown) {

                        (this as unknown as CustomElement).dispatchCustomEvent(selectionChangedEvent, {
                            element: this,
                            selected: value,
                            value: (this as unknown as SelectableMixin).selectValue
                        })
                    }
                },

                /**
                 * The value to return when the component gets selected
                 */
                selectValue: {
                    attribute: 'select-value',
                    type: [
                        DataTypes.String,
                        DataTypes.Object
                    ]
                }
            };
        }

        // The mixin constructor requires the parameters signature to be of type any
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        constructor(...args: any[]) {

            super(args);

            this.toggleSelect = this.toggleSelect.bind(this);
        }

        connectedCallback() {

            super.connectedCallback?.();

            this.addEventListener('click', this.toggleSelect);
        }

        disconnectedCallback() {

            super.disconnectedCallback?.();

            this.removeEventListener('click', this.toggleSelect);
        }

        toggleSelect() {

            this.selected = !this.selected; // Toggle
        }
    }
}