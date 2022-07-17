import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata"
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor"
import { DataTypes } from "../../../utils/data/DataTypes"

export default function DataCollectionHolder<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class DataCollectionHolderMixin extends Base {

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
                    value: []
                    //required: true - We might need to load it after connecting the component
                }
            }
        }
    }
}