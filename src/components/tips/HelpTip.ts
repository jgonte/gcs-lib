import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../utils/data/DataTypes";
import Sizable from "../mixins/sizable/Sizable";
import renderTip from "./renderTip";

export default class HelpTip extends Sizable(
    CustomElement as CustomHTMLElementConstructor
) {

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The key to retrieve a localized value from an i18n provider
             */
            resourceKey: {
                attribute: 'resource-key',
                type: DataTypes.String
            },

            /**
             * The help text if the resoource key is not used
             */
            text: {
                type: DataTypes.String
            },
        };
    }

    render(): NodePatchingData {

        return renderTip('secondary', '?', this.resourceKey, this.text);
    }
}

defineCustomElement('wcl-help-tip', HelpTip);
