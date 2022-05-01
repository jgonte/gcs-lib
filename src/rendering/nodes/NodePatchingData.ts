import { CompiledNodePatcherRule } from "../rules/CompiledNodePatcherRule";
import { INodePatcher } from "../patcher/INodePatcher";

export type NodePatchingDataValue = NodePatchingData | EventListenerOrEventListenerObject | string | number | boolean | object | null;

export type NodePatchingDataValues = NodePatchingDataValue[] | NodePatchingDataValue[][];

export interface NodePatchingDataHolder {
    _$patchingData: NodePatchingData | string
}

export type PatchedNode = Node & NodePatchingDataHolder;

export type PatchedChildNode = ChildNode & NodePatchingDataHolder;

export type PatchedHTMLElement = HTMLElement & NodePatchingDataHolder | Record<string, unknown>;

export type AnyPatchedNode = PatchedNode | PatchedChildNode | PatchedHTMLElement;

/**
 * The patching data with the information to patch a node
 */
export interface NodePatchingData {

    /**
     * The node to be patched (it does not exist until it is created if needed)
     */
    node?: AnyPatchedNode;

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
    values: NodePatchingDataValues;
}