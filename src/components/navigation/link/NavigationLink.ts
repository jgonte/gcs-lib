import defineCustomElement from "../../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import mergeStyles from "../../../custom-element/styles/mergeStyles";
import html from "../../../rendering/html";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import { DataTypes } from "../../../utils/data/DataTypes";
import Clickable from "../../mixins/clickable/Clickable";
import Nuanced from "../../Nuanced";
import { navigationLinkStyles } from "./NavigationLink.styles";

export const linkClickedEvent = 'linkClickedEvent';

/**
 * Initiates a routing workflow when clicked
 */
export default class NavigationLink
    extends Clickable(
        Nuanced
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, navigationLinkStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the path to append to the URL
             */
            to: {
                type: DataTypes.String,
                required: true
            },
        }
    }

    render(): NodePatchingData {

        return html`<slot></slot>`;
    }

    handleClick() {

        this.active = true;

        this.dispatchCustomEvent(linkClickedEvent, {
            link: this
        });
    }

}

defineCustomElement('wcl-nav-link', NavigationLink);