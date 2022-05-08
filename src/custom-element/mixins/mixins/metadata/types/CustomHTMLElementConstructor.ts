import { NodePatchingData } from "../../../../../rendering/nodes/NodePatchingData";
import { Constructor } from "../../../../../utils/types";
import CustomElementComponentMetadata from "../../../metadata/types/CustomElementComponentMetadata";
import CustomElementMetadata from "../../../metadata/types/CustomElementMetadata";
import CustomElementPropertyMetadata from "../../../metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../metadata/types/CustomElementStateMetadata";


export interface CustomHTMLElement extends HTMLElement {

    render() : NodePatchingData | NodePatchingData[];

    beforeRender(patchingData: NodePatchingData | NodePatchingData[]) : NodePatchingData | NodePatchingData[];

    get document(): HTMLElement | ShadowRoot;

    stylesAdded: boolean;

    adoptedChildren: Node[];
}

export default interface CustomHTMLElementConstructor extends Constructor<CustomHTMLElement> {

    component: CustomElementComponentMetadata;

    properties: Record<string, CustomElementPropertyMetadata>;

    state: Record<string, CustomElementStateMetadata>;

    styles?: string;

    get metadata(): CustomElementMetadata;
}