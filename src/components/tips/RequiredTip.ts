import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import Sizable from "../mixins/sizable/Sizable";
import renderTip from "./renderTip";

export default class RequiredTip extends Sizable(
    CustomElement as CustomHTMLElementConstructor
) {

    render(): NodePatchingData {

        return renderTip('danger', '*', 'thisFieldIsRequired');
    }
}

defineCustomElement('wcl-required-tip', RequiredTip);