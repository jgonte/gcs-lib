import { Constructor } from "../../../../utils/types";
import CustomElementComponentMetadata from "./CustomElementComponentMetadata";
import CustomElementMetadata from "./CustomElementMetadata";
import CustomElementPropertyMetadata from "./CustomElementPropertyMetadata";
import CustomElementStateMetadata from "./CustomElementStateMetadata";
import CustomHTMLElement from "./CustomHTMLElement";

/**
 * Defines the additional members of the constructor of the CustomHTMLElement
 */
export default interface CustomHTMLElementConstructor extends Constructor<CustomHTMLElement> {
    
    _isCustomElement: boolean;

    component: CustomElementComponentMetadata;

    properties: Record<string, CustomElementPropertyMetadata>;

    state: Record<string, CustomElementStateMetadata>;

    styles?: string;

    atomic?: boolean;

    get metadata(): CustomElementMetadata;
}