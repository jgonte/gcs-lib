import { NodePatchingData } from "../rendering/nodes/NodePatchingData";

/**
 * The base class for all the custom elements
 */
export default abstract class CustomElement extends HTMLElement {

    /**
     * The render method that needs to be implemented by the derived elements
     */
    abstract render(): NodePatchingData | NodePatchingData[];
}