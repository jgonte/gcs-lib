import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata"
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor"
import { DataTypes } from "../../../utils/data/DataTypes"
import { GenericRecord } from "../../../utils/types"
import SorterTool, { sorterChanged } from "../../tools/sorter/SorterTool"

export default function DataCollectionHolder<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class DataCollectionHolderMixin extends Base {

        _lastSorter?: SorterTool;

        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * The collection of records to render
                 */
                data: {
                    type: [
                        DataTypes.Array,
                        DataTypes.Function
                    ],
                    value: [],
                    // transform: function(value: unknown) {

                    //     return typeof value === 'function'? 
                    //         value() : // Get the array the function holds
                    //         value;
                    // }
                    //required: true - We might need to load it after connecting the component
                }
            }
        }

        connectedCallback() {

            super.connectedCallback?.();
    
            this.addEventListener(sorterChanged, this.sort as EventListenerOrEventListenerObject);
        }
    
        disconnectedCallback() {
    
            super.disconnectedCallback?.();
    
            this.removeEventListener(sorterChanged, this.sort as EventListenerOrEventListenerObject);
        }

        /**
         * Sorts the data
         */
        sort(event: CustomEvent): void {

            const {
                field,
                ascending,
                element // Send this element to track the current sorter
            } = event.detail;

            if (this._lastSorter !== element) {

                if (this._lastSorter !== undefined) {

                    this._lastSorter.ascending = undefined;
                }

                this._lastSorter = element;                
            }

            if (this.loader !== undefined) { // Sort in the server

                throw new Error('Not implemented');
            }
            else { // Sort locally

                const comparer = (r1: GenericRecord, r2: GenericRecord) => {

                    if (ascending === true) {

                        return (r1[field] as number) - (r2[field] as number);
                    }
                    else {

                        return (r2[field] as number) - (r1[field] as number);
                    }
                }

                this.data = [...this.data].sort(comparer); // Clone the array so they are different
            }
        }
    }
}