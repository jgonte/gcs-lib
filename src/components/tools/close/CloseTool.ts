import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata, { ConversionTypes } from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import Tool from "../Tool";

export default class CloseTool extends Tool {

    constructor() {

        super();
        
        this.iconName = "x";
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * What action to execute when the tool has been closed
             */
            close: {
                type: ConversionTypes.Function,
                required: true
            }
        };
    }

    click() {

        this.close?.();
    }
}

defineCustomElement('wcl-close-tool', CloseTool);