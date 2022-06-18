import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata, { ConversionTypes } from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import Tool from "../Tool";

export const sorterChanged = 'sorterChanged';

export default class SorterTool extends Tool {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the field to sort
             */
            field: {
                type: ConversionTypes.String,
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

    click = () => {

        const {
            field
        } = this;

        let {
            ascending
        } = this;

        ascending = !ascending;

        this.ascending = ascending;

        this.dispatchEvent(new CustomEvent(sorterChanged, {
            detail: {
                field,
                ascending,
                element: this // Send this element to track the current sorter
            },
            bubbles: true,
            composed: true
        }));

    };
}

defineCustomElement('wcl-sorter-tool', SorterTool);