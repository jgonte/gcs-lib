import isPrimitive from "../../utils/isPrimitive";
import createNodes from "../nodes/createNodes";
import { AnyPatchedNode, NodePatchingData } from "../nodes/NodePatchingData";
import { endMarker } from "../template/markers";
import areEquivalentValues from "../utils/areEquivalentValues";

export default function replaceChild(markerNode: Node, newChild: NodePatchingData, oldChild: NodePatchingData) {

    if (isPrimitive(newChild) &&
        isPrimitive(oldChild)) {

        // Find the node whose old value matches the old child
        const oldChildNode = findPreviousSibling(markerNode,
            node => node instanceof Text &&
                (node as Text).textContent === oldChild.toString());

        if (oldChildNode !== null) { // Otherwise already updated???

            (oldChildNode as Text).textContent = newChild.toString();
        }

    }
    else if ((oldChild as NodePatchingData).patcher !== undefined) { // Patching data

        // Find the node whose patching data matches this one
        let oldChildNode: AnyPatchedNode | null = null;

        findPreviousSibling(
            markerNode,
            node => testThisOrAnyParent(node, (n: AnyPatchedNode) => {

                if (n._$patchingData === undefined) {

                    return false;
                }

                const {
                    patcher,
                    values
                } = n._$patchingData as NodePatchingData;

                const {
                    patcher: otherPatcher,
                    values: otherValues
                } = oldChild as NodePatchingData;

                const r = patcher === otherPatcher &&
                    areEquivalentValues(values, otherValues);

                if (r === true) {

                    oldChildNode = n;
                }

                return r;
            }));

        if (oldChildNode === null) {

            throw new Error('oldChildNode cannot be null');
        }

        const {
            patcher: oldPatcher,
            rules,
            values: oldValues
        } = (oldChildNode as AnyPatchedNode)._$patchingData as NodePatchingData;

        const {
            patcher,
            values
        } = newChild as NodePatchingData;

        if (patcher === oldPatcher) {

            // if ((newChild as any).rules === null) {

            //     (newChild as any).rules = rules; // Transfer the compiled rules
            // }

            oldPatcher.patchNode(rules || [], oldValues, values);

            newChild.node = (oldChild as NodePatchingData).node;

            ((oldChildNode as AnyPatchedNode)._$patchingData as NodePatchingData).values = values; // Update the latest values 
        }
        else { // Different patchers (type of nodes)

            const {
                parentNode
            } = oldChildNode;

            const newChildNode = createNodes(newChild);

            (parentNode as Node).replaceChild(newChildNode, oldChildNode);
        }
    }
    else { // They are nodes

        throw new Error('kuku');
        //parentNode!.replaceChild(newChild, oldChild);
    }
}

function findPreviousSibling(markerNode: Node, predicate: (node: AnyPatchedNode) => boolean): Node | null {

    let {
        previousSibling
    } = markerNode;

    while (previousSibling !== null &&
        (previousSibling as Comment).textContent !== endMarker) {

        if (predicate(previousSibling as AnyPatchedNode) === true) {

            return previousSibling;
        }

        previousSibling = previousSibling.previousSibling;
    }

    return null;
}

function testThisOrAnyParent(node: AnyPatchedNode, predicate: (n: AnyPatchedNode) => boolean): boolean {

    let parentNode: AnyPatchedNode | null = node;

    while (parentNode !== null) {

        if (predicate(parentNode) === true) {

            return true;
        }

        parentNode = parentNode.parentNode as AnyPatchedNode;
    }

    return false;
}
