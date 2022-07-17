import { INodePatcher } from "./INodePatcher";
import isPrimitive from "../../utils/isPrimitive";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import createNodes from "../nodes/createNodes";
import mountNodes from "../nodes/mountNodes";
import { ExtensibleHTMLElement, NodePatchingData, NodePatchingDataValues } from "../nodes/NodePatchingData";
import { CompiledNodePatcherRule } from "../rules/CompiledNodePatcherRule";
import createNodePatcherRules from "../rules/createNodePatcherRules";
import { CompiledNodePatcherAttributeRule } from "../rules/NodePatcherAttributeRule";
import { NodePatcherRule, NodePatcherRuleTypes } from "../rules/NodePatcherRule";
import createTemplate from "../template/createTemplate";
import setAttribute from "../dom/setAttribute";
import { CompiledNodePatcherEventRule } from "../rules/NodePatcherEventRule";
import areEquivalentValues from "../utils/areEquivalentValues";
import updateNodes from "../nodes/updateNodes";
import replaceChild from "../dom/replaceChild";
import removeLeftSiblings from "../dom/removeLeftSiblings";
import removeLeftSibling from "../dom/removeLeftSibling";
import { setEvent } from "../dom/setEvent";

export default class NodePatcher implements INodePatcher {

    /**
     * The inner HTML of the template content to help debugging
     */
    templateString: string;

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
     * Whether the content of the template has a single element
     */
    isSingleElement: boolean;

    constructor(strings: TemplateStringsArray) {

        const {
            templateString,
            template,
            keyIndex
        } = createTemplate(strings);

        this.templateString = templateString; // To make debugging easier

        this.template = template;

        const childNodes = template.content.childNodes;

        this.isSingleElement = childNodes.length === 1 &&
            childNodes[0].nodeType === Node.ELEMENT_NODE;

        this.rules = createNodePatcherRules(template.content);

        this.keyIndex = keyIndex;
    }

    firstPatch(
        rules: CompiledNodePatcherRule[],
        values: NodePatchingDataValues = []
    ): void {

        const {
            length
        } = rules;

        for (let i = 0; i < length; ++i) { // The index of the values of the rules match 1 to 1 with the number of rules

            const value = values[i];

            const rule = rules[i];

            const {
                type,
                node
            } = rule;

            switch (type) {

                case NodePatcherRuleTypes.PATCH_CHILDREN:
                    {
                        const { parentNode } = node;

                        if (Array.isArray(value)) {

                            const df = document.createDocumentFragment();

                            value.forEach(v => {

                                if (isPrimitive(v)) {

                                    const n = document.createTextNode((v as NodePatchingDataValues).toString());

                                    (parentNode as Node).insertBefore(n, node);
                                }
                                else {

                                    mountNodes(df, v as NodePatchingData);
                                }
                            });

                            (parentNode as Node).insertBefore(df, node);
                        }
                        else if (!isUndefinedOrNull(value)) {

                            const n = createNodes(value as NodePatchingData);

                            (parentNode as Node).insertBefore(n, node);
                        }
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_ATTRIBUTE:
                    {
                        const {
                            name,
                            property
                        } = rule as CompiledNodePatcherAttributeRule;

                        setAttribute(node as ExtensibleHTMLElement, name, property, value);
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_EVENT:
                    {
                        const {
                            name
                        } = rule as CompiledNodePatcherEventRule;

                        setEvent(name, value, null, node);
                    }
                    break;
                default: throw new Error(`firstPatch is not implemented for rule type: ${type}`);
            }
        }
    }

    patchNode(
        rules: CompiledNodePatcherRule[],
        oldValues: NodePatchingDataValues = [],
        newValues: NodePatchingDataValues = []
    ): void {

        const {
            length
        } = rules;

        for (let i = 0; i < length; ++i) { // The index of the values of the rules match 1 to 1 with the number of rules

            const oldValue = oldValues[i];

            const newValue = newValues[i];

            if (areEquivalentValues(oldValue, newValue)) {

                continue;
            }

            const rule = rules[i];

            const {
                type,
                node
            } = rule;

            switch (type) {

                case NodePatcherRuleTypes.PATCH_CHILDREN:
                    {
                        if (Array.isArray(newValue)) {

                            patchChildren(node, oldValue as NodePatchingData[], newValue as NodePatchingData[]);
                        }
                        else { // Single node

                            if (!isUndefinedOrNull(newValue)) {

                                if (isUndefinedOrNull(oldValue)) {

                                    insertBefore(node, newValue as NodePatchingData);
                                }
                                else {

                                    if ((oldValue as NodePatchingData).patcher !== undefined &&
                                        (oldValue as NodePatchingData).patcher === (newValue as NodePatchingData).patcher) {

                                        updateNodes(node, oldValue as NodePatchingData, newValue as NodePatchingData);
                                    }
                                    else {

                                        replaceChild(node, newValue as NodePatchingData, oldValue as NodePatchingData);
                                    }
                                }
                            }
                            else { // newValue === undefined || null

                                if (oldValue !== undefined &&
                                    oldValue !== null) {

                                    if (Array.isArray(oldValue) || // Several nodes to remove
                                        (oldValue as NodePatchingData).patcher !== undefined) {

                                        removeLeftSiblings(node);
                                    }
                                    else { // Only one node to remove

                                        removeLeftSibling(node);
                                    }
                                }
                            }
                        }
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_ATTRIBUTE:
                    {
                        const {
                            name,
                            property
                        } = rule as CompiledNodePatcherAttributeRule;

                        setAttribute(node as ExtensibleHTMLElement, name, property, newValue);
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_EVENT:
                    {
                        const {
                            name
                        } = rule as CompiledNodePatcherEventRule;

                        setEvent(name, newValue, oldValue, node);
                    }
                    break;
                default: throw new Error(`patch is not implemented for rule type: ${type}`);
            }

        }
    }


}

function patchChildren(markerNode: Node, oldChildren: NodePatchingData[] = [], newChildren: NodePatchingData[] = []): void {

    oldChildren = oldChildren || [];

    let { length: oldChildrenCount } = oldChildren;

    const keyedNodes = MapKeyedNodes(oldChildren);

    const { length: newChildrenCount } = newChildren;

    for (let i = 0; i < newChildrenCount; ++i) {

        const newChild = newChildren[i];

        const newChildKey = getKey(newChild);

        const oldChild = oldChildren[i];

        if (oldChild === undefined) { // No more old children

            if (keyedNodes.has(newChildKey)) { // There is an old child with the same key

                const oldChild = keyedNodes.get(newChildKey);

                updateNodes((oldChild as NodePatchingData).node as ExtensibleHTMLElement, oldChild as NodePatchingData, newChild); // Patch the old node if there are differences
            }
            else { // There is no old child with that key

                insertBefore(markerNode, newChild);

                ++oldChildrenCount; // Update the count of extra nodes to remove
            }
        }
        else { // oldChild !== undefined

            const oldChildKey = getKey(oldChild);

            if (newChildKey === oldChildKey) { // Patch the node

                if (isPrimitive(oldChild)) {

                    replaceChild(markerNode, newChild, oldChild)
                }
                else {

                    updateNodes((oldChild as NodePatchingData).node as ExtensibleHTMLElement, oldChild as NodePatchingData, newChild); // Patch the old node if there are differences
                }
            }
            else { // newChildKey !== oldChildKey

                if (keyedNodes.has(newChildKey)) { // There is an old child with the same key

                    const oldKeyedChild = keyedNodes.get(newChildKey);

                    updateNodes((oldKeyedChild as NodePatchingData).node as ExtensibleHTMLElement, oldKeyedChild as NodePatchingData, newChild); // Patch the old node if there are differences

                    replaceChild(markerNode, oldKeyedChild as NodePatchingData, oldChild as NodePatchingData);
                }
                else {

                    const { parentNode } = markerNode;

                    const existingChild = parentNode?.childNodes[i + 1]; // Skip the begin marker node

                    insertBefore(existingChild as ChildNode, newChild);

                    ++oldChildrenCount; // Update the count of extra nodes to remove
                }
            }
        }
    }

    // Remove the extra nodes
    for (let i = oldChildrenCount - 1; i >= newChildrenCount; --i) {

        removeLeftSibling(markerNode);
    }
}

/**
 * Maps the keyed nodes from the old children nodes
 * @param children 
 * @returns 
 */
function MapKeyedNodes(children: NodePatchingData[]) {

    const keyedNodes = new Map<unknown, NodePatchingData>();

    children.forEach(child => {

        const key = getKey(child);

        if (key !== null) {

            keyedNodes.set(key, child);
        }
    });

    return keyedNodes;
}

/**
 * Retrieves the key from the patching data
 * @param patchingData 
 * @returns 
 */
function getKey(patchingData: NodePatchingData): string | null {

    if (isPrimitive(patchingData)) {

        return null;
    }

    const {
        patcher,
        values
    } = patchingData as NodePatchingData;

    const {
        keyIndex
    } = patcher;

    return keyIndex !== undefined ?
        values[keyIndex] as string :
        null;
}

function insertBefore(markerNode: Node, newChild: NodePatchingData): void {

    const { parentNode } = markerNode;

    const node = createNodes(newChild as NodePatchingData);

    (parentNode as Node).insertBefore(node, markerNode);
}