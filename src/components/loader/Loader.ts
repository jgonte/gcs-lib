import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Loadable from "../mixins/data/Loadable";

/**
 * Wrapper to allow loading data for a child component
 */
export default class Loader extends
    Loadable(
        CustomElement as CustomHTMLElementConstructor
    ) {

    render(): NodePatchingData {

        return html`
<div style="position: relative;">
    ${this.renderLoading()}
    <slot id="data-holder"></slot>
</div>`;
    }

    didMountCallback() {

        // Bind to the data property of the child (assuming a single child)
        this.dataHolder = ((this.document as ShadowRoot).getElementById('data-holder') as HTMLSlotElement)
            .assignedElements({ flatten: false })[0]; // Only include elements

        this.dataHolder.loader = this; // Inject the loader

        super.didMountCallback?.();
    }

    handleLoadedData(data: { payload: object; }) {

        this.dataHolder.data = data.payload || data;
    }
}

defineCustomElement('wcl-loader', Loader);