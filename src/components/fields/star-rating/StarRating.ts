import DisplayableField from "../DisplayableField";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import SelectionContainer, { SelectionTypes } from "../../mixins/selection-container/SelectionContainer";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";

const getStarStyle = (selected: boolean): string => selected == true ?
    'color: yellow;' :
    'color: lightgray;'

export default class StarRating
    extends SelectionContainer(
        DisplayableField as unknown as CustomHTMLElementConstructor
    ) {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The total number of stars
             */
            max: {
                type: DataTypes.Number,
                value: 5,
                reflect: true
            }
        }
    }

    render(): NodePatchingData[] {

        const {
            max,
            value
        } = this;

        const stars = [];

        for (let i = 0; i < max; ++i) {

            const selected = i < value;

            stars.push(
                html`
<wcl-selector key=${i} select-value=${i + 1} selected=${selected}>
    <wcl-icon name="star-fill" style=${getStarStyle(selected)}></wcl-icon>
</wcl-selector>`
            );

        }

        return stars;
    }

    selectionChanged = (selection: SelectionTypes /*, selectedChildren: CustomElement[] */): void => {

        this.value = selection[0];

        // Deselect the stars after this

    };
}

defineCustomElement('wcl-star-rating', StarRating);