// Building blocks
import CustomHTMLElementConstructor from "./custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import CustomElement from "./custom-element/CustomElement";
import defineCustomElement from "./custom-element/defineCustomElement";
import CustomElementComponentMetadata from "./custom-element/mixins/metadata/types/CustomElementComponentMetadata";
import CustomElementPropertyMetadata from "./custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "./custom-element/mixins/metadata/types/CustomElementStateMetadata";
import { NodePatchingData } from "./rendering/nodes/NodePatchingData";
import html from "./rendering/html";

// Components
import Icon from "./components/icon/Icon";
import LocalizedText from "./components/localized-text/LocalizedText";
import Button from "./components/button/Button";
import DataTemplate from "./components/data-template/DataTemplate";

// Make it available in the global object of the browser
(window as unknown as Record<string, unknown>).html = html;

export {
    // Building blocks
    CustomHTMLElementConstructor,
    CustomElement,
    CustomElementComponentMetadata,
    CustomElementPropertyMetadata,
    defineCustomElement,
    CustomElementStateMetadata,
    NodePatchingData,

    // Components
    Icon,
    LocalizedText,
    Button,
    DataTemplate
}