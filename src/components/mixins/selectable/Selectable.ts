import CustomElementPropertyMetadata, { ConversionTypes } from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
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
                    type: ConversionTypes.Boolean,
                    value: true,
                    reflect: true,
                    inherit: true
                },

                /**
                 * Whether the item is selected
                 */
                selected: {
                    type: ConversionTypes.Boolean,
                    reflect: true
                },

                /**
                 * The value to return when the component gets selected
                 */
                selectValue: {
                    attribute: 'select-value',
                    type: [
                        ConversionTypes.String,
                        ConversionTypes.Object
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

            let {
                selected
            } = this;

            selected = !selected; // Toggle

            this._setSelection(selected);
        }

        /**
         * Select this component programmatically
         */
        select() {

            const {
                selected
            } = this;

            if (selected === true) {

                return;
            }

            this._setSelection(true);
        }

        private _setSelection(selected: boolean) {

            if (!this.selectable) {

                return;
            }

            if (this.selected === selected) {

                return; // Nothing to select
            }

            this.selected = selected;

            this.dispatchEvent(new CustomEvent(selectionChangedEvent, {
                detail: {
                    element: this,
                    selected,
                    value: this.selectValue
                },
                bubbles: true,
                composed: true
            }));
        }
    }
}