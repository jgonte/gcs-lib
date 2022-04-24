import { CompiledNodePatcherRule } from "../rules/CompiledNodePatcherRule";
import { NodePatcherRule } from "../rules/NodePatcherRule";

/**
 * The interface that describes the functionality of a node patcher
 */
export interface INodePatcher {

    /**
     * The template to clone and generate the node from
     */
    template: HTMLTemplateElement;

    /**
     * The rules to be cloned (compiled)to execute the patching
     */
    rules: NodePatcherRule[];

    /**
     * The index of the dynamic property where the key is
     */
     keyIndex?: number;

    /**
     * The first patch to create the node
     * @param doc
     * @param rules 
     * @param values 
     */
    firstPatch(doc: Node, rules: CompiledNodePatcherRule[], values: any[]): void;

    /**
     * The patch to update the node
     * @param parentNode 
     * @param rules 
     * @param oldValues 
     * @param newValues 
     * @param compareValues 
     */
     patchNode(parentNode: Node, rules: CompiledNodePatcherRule[], oldValues: any[], newValues: any[]) :void
}