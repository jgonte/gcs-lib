import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata"
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor"
import { DataTypes } from "../../../utils/data/DataTypes"

export default function DataHolder<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class DataHolderMixin extends Base {

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
                },

                /**
                 * The field that provides a unique id for the record
                 */
                idField: {
                    attribute: 'id-field',
                    type: DataTypes.String,
                    required: true
                }
            }
        }
    }
}