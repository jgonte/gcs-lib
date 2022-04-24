import isPrimitive from "../../utils/isPrimitive";
import createNodes from "../nodes/createNodes";
import { NodePatchingData } from "../nodes/NodePatchingData";
import { endMarker } from "../template/markers";
import areEquivalentValues from "../utils/areEquivalentValues";

export default function replaceChild(markerNode: Node, newChild: NodePatchingData, oldChild: NodePatchingData) {

    const {
        parentNode
    } = markerNode;

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
    else if ((oldChild as any).patcher !== undefined) { // Patching data

        // Find the node whose patching data matches this one
        let oldChildNode: Node | null = null;

        findPreviousSibling(
            markerNode,
            node => testThisOrAnyParent(node, n => {

                if (n._$patchingData === undefined) {

                    return false;
                }

                const {
                    patcher,
                    values
                } = n._$patchingData;

                const {
                    patcher: otherPatcher,
                    values: otherValues
                } = oldChild as any;

                const r = patcher === otherPatcher &&
                    areEquivalentValues(values, otherValues);

                if (r === true) {

                    oldChildNode = n;
                }

                return r;
            }));

        const {
            patcher: oldPatcher,
            rules,
            values: oldValues
        } = (oldChildNode as any)._$patchingData;

        const {
            patcher,
            values
        } = (newChild as any);

        if (patcher === oldPatcher) {

            // if ((newChild as any).rules === null) {

            //     (newChild as any).rules = rules; // Transfer the compiled rules
            // }

            oldPatcher.patchNode(oldChildNode, rules, oldValues, values);

            (newChild as any).node = (oldChild as any).node;

            (oldChildNode as any)._$patchingData.values = values; // Update the latest values 
        }
        // else { // Different patchers (type of nodes)

        //     const {
        //         parentNode
        //     } = oldChildNode!;

        //     const newChildNode = createNodes(newChild as any);

        //     parentNode!.replaceChild(newChildNode, oldChildNode!);
        // }
    }
    // else { // They are nodes

    //     throw new Error('kuku')
    //     //parentNode!.replaceChild(newChild, oldChild);
    // }
}

function findPreviousSibling(markerNode: Node, predicate: (node: any) => boolean): Node | null {

    let {
        previousSibling
    } = markerNode;

    while (previousSibling !== null &&
        (previousSibling as Comment).textContent !== endMarker) {

        if (predicate(previousSibling) === true) {

            return previousSibling;
        }

        previousSibling = previousSibling.previousSibling;
    }

    return null;
}

function testThisOrAnyParent(node: Node, predicate: (n: any) => boolean): boolean {

    let parentNode = node;

    while (parentNode !== null) {

        if (predicate(parentNode) === true) {

            return true;
        }

        parentNode = parentNode.parentNode!;
    }

    return false;
}
