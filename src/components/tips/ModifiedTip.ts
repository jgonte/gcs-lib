import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Sizable from "../mixins/sizable/Sizable";
import renderTip from "./renderTip";

export default class ModifiedTip extends Sizable(
    CustomElement as CustomHTMLElementConstructor
) {

    render(): NodePatchingData {

        return renderTip('primary', 'M', 'thisFieldHasBeenModified');
    }
}

defineCustomElement('wcl-modified-tip', ModifiedTip);
