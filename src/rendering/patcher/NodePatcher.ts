import { INodePatcher } from "./INodePatcher";
import isPrimitive from "../../utils/isPrimitive";
import createNodes from "../nodes/createNodes";
import mountNodes from "../nodes/mountNodes";
import { NodePatchingData } from "../nodes/NodePatchingData";
import { CompiledNodePatcherRule } from "../rules/CompiledNodePatcherRule";
import createNodePatcherRules from "../rules/createNodePatcherRules";
import { CompiledNodePatcherAttributeRule } from "../rules/NodePatcherAttributeRule";
import { NodePatcherRule, NodePatcherRuleTypes } from "../rules/NodePatcherRule";
import createTemplate from "../template/createTemplate";
import setAttribute from "../dom/setAttribute";
import { CompiledNodePatcherEventRule } from "../rules/NodePatcherEventRule";
import getGlobalFunction from "../../utils/getGlobalFunction";
import areEquivalentValues from "../utils/areEquivalentValues";
import updateNodes from "../nodes/updateNodes";
import replaceChild from "../dom/replaceChild";
import removeLeftSiblings from "../dom/removeLeftSiblings";
import removeLeftSibling from "../dom/removeLeftSibling";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";

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

    firstPatch(parentNode: Node, rules: CompiledNodePatcherRule[], values: any[] = []): void {

        const {
            length
        } = rules;

        for (let i = 0; i < length; ++i) { // The index of the values of the rules match 1 to 1 with the number of rules

            let value = values[i];

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

                                    const n = document.createTextNode(v.toString());

                                    parentNode!.insertBefore(n, node);
                                }
                                else {

                                    mountNodes(df, v);
                                }
                            });

                            parentNode!.insertBefore(df, node);
                        }
                        else if (value !== undefined &&
                            value !== null) {

                            let n = value;

                            if (isPrimitive(value)) {

                                n = document.createTextNode(value.toString());
                            }
                            else if ((value as NodePatchingData).patcher !== undefined) {

                                n = createNodes(value as NodePatchingData);
                            }

                            parentNode!.insertBefore(n, node);
                        }
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_ATTRIBUTE:
                    {
                        const {
                            name,
                            property
                        } = rule as CompiledNodePatcherAttributeRule;

                        setAttribute(node as HTMLElement, name, property, value);
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_EVENT:
                    {
                        const {
                            name
                        } = rule as CompiledNodePatcherEventRule;

                        const eventName: string = name.slice(2).toLowerCase();

                        const nameParts = eventName.split('_'); // Just in case it has the capture parameter in the event

                        const useCapture: boolean = nameParts[1]?.toLowerCase() === 'capture'; // The convention is: eventName_capture for capture. Example onClick_capture

                        if (typeof value === 'string') {

                            value = getGlobalFunction(value);
                        }

                        if (value !== undefined) {

                            node.addEventListener(eventName, value, useCapture);
                        }

                        // Remove the attribute from the HTML
                        (node as HTMLElement).removeAttribute(name);
                    }
                    break;
                default: throw Error(`firstPatch is not implemented for rule type: ${type}`);
            }
        }
    }

    patchNode(parentNode: Node, rules: CompiledNodePatcherRule[], oldValues: any[] = [], newValues: any[] = []): void {

        const {
            length
        } = rules;

        for (let i = 0; i < length; ++i) { // The index of the values of the rules match 1 to 1 with the number of rules

            const oldValue = oldValues[i];

            let newValue = newValues[i];

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

                            patchChildren(node, oldValue, newValue);
                        }
                        else { // Single node

                            if (newValue !== undefined &&
                                newValue !== null) {

                                if (oldValue === undefined ||
                                    oldValue === null) {

                                    insertBefore(node, newValue);
                                }
                                else {

                                    if (oldValue.patcher !== undefined &&
                                        oldValue.patcher === newValue.patcher) {

                                        updateNodes(node, oldValue, newValue);
                                    }
                                    else {

                                        replaceChild(node, newValue, oldValue);
                                    }
                                }
                            }
                            else { // newValue === undefined || null

                                if (oldValue !== undefined &&
                                    oldValue !== null) {

                                    if (Array.isArray(oldValue) || // Several nodes to remove
                                        oldValue.patcher !== undefined) {

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

                        setAttribute(node as HTMLElement, name, property, newValue);
                    }
                    break;
                case NodePatcherRuleTypes.PATCH_EVENT:
                    {
                        const {
                            name
                        } = rule as CompiledNodePatcherEventRule;

                        const eventName: string = name.slice(2).toLowerCase();

                        const nameParts = eventName.split('_'); // Just in case it has the capture parameter in the event

                        const useCapture: boolean = nameParts[1]?.toLowerCase() === 'capture'; // The convention is: eventName_capture for capture. Example onClick_capture

                        if (typeof newValue === 'string') {

                            newValue = getGlobalFunction(newValue);
                        }

                        if (isUndefinedOrNull(oldValue) &&
                            !isUndefinedOrNull(newValue)) {

                            node.addEventListener(eventName, newValue, useCapture);
                        }

                        if (!isUndefinedOrNull(oldValue) &&
                            isUndefinedOrNull(newValue)) {

                            const value = typeof oldValue === 'function' ?
                                oldValue :
                                getGlobalFunction(oldValue);

                            node.removeEventListener(eventName, value, useCapture);
                        }

                        // Remove the attribute from the HTML
                        (node as HTMLElement).removeAttribute(name);
                    }
                    break;
                default: throw Error(`patch is not implemented for rule type: ${type}`);
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

                updateNodes(oldChild!.node!, oldChild!, newChild); // Patch the old node if there are differences
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

                    updateNodes(oldChild!.node!, oldChild!, newChild); // Patch the old node if there are differences
                }
            }
            else { // newChildKey !== oldChildKey

                if (keyedNodes.has(newChildKey)) { // There is an old child with the same key

                    const oldKeyedChild = keyedNodes.get(newChildKey);

                    updateNodes(oldKeyedChild!.node!, oldKeyedChild!, newChild); // Patch the old node if there are differences

                    replaceChild(markerNode, oldKeyedChild!, oldChild!);
                }
                else {

                    const { parentNode } = markerNode;

                    const existingChild = parentNode!.childNodes[i + 1]; // Skip the begin marker node

                    insertBefore(existingChild, newChild);

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

        let key = getKey(child);

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
function getKey(patchingData: NodePatchingData) {

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
        values[keyIndex] :
        null;
}

function insertBefore(markerNode: Node, newChild: NodePatchingData): void {

    const { parentNode } = markerNode;

    const node = createNodes(newChild as NodePatchingData);

    parentNode!.insertBefore(node, markerNode);
}