import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import { DataTypes } from "../../../utils/data/DataTypes";
import Tool from "../Tool";

export const sorterChanged = 'sorterChanged';

export default class SorterTool extends Tool {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the field to sort
             */
            field: {
                type: DataTypes.String,
                required: true
            }
        };
    }

    static get state(): Record<string, CustomElementStateMetadata> {

        return {

            ascending: {
                value: undefined
            }
        };
    }

    // It is a property assignment
    iconName = () => {

        const {
            ascending
        } = this;

        if (ascending === undefined) {

            return 'arrow-down-up';
        }

        return ascending === true ?
            'arrow-up' :
            'arrow-down';
    }

    handleClick(): void {

        this.ascending = !this.ascending;

        this.dispatchCustomEvent(sorterChanged, {
            field: this.field,
            ascending: this.ascending,
            element: this // Send this element to track the current sorter
        });

    }
}

defineCustomElement('wcl-sorter-tool', SorterTool);