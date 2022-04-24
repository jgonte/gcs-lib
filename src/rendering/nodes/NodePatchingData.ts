import { CompiledNodePatcherRule } from "../rules/CompiledNodePatcherRule";
import { INodePatcher } from "../patcher/INodePatcher";

/**
 * The patching data with the information to patch a node
 */
export interface NodePatchingData {

    /**
     * The node to be patched (it does not exist until it is created if needed)
     */
    node?: Node;

    /**
     * The patcher to patch the node with the values according to the rules
     */
    patcher: INodePatcher;

    /**
     * The rules to use to patch the node
     */
    rules: CompiledNodePatcherRule[] | null;

    /**
     * The values used to feed the rules
     */
    values: any[];
}