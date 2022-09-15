import { NodePatchingData } from "../nodes/NodePatchingData";
import NodePatcher from "../patcher/NodePatcher";
import isNodePatchingData from "./isNodePatchingData";

/**
 * Transfers the existing nodes from the oldPatchingData values to the newPatchingData ones
 * @param oldPatchingData 
 * @param newPatchingData 
 */
export default function transferNodesAndRules(oldPatchingData: NodePatchingData | NodePatchingData[], newPatchingData: NodePatchingData | NodePatchingData[]) {

    if (Array.isArray(newPatchingData)) {

        for (let i = 0; i < newPatchingData.length; ++i) {

            const oldData = (oldPatchingData as NodePatchingData[])[i];

            const newData = newPatchingData[i];

            if (isNodePatchingData(oldData)) { // It is a node patching data

                const {
                    node,
                    rules
                } = oldData;

                if (node === undefined) {

                    throw new Error(`Node is required in node patching data: ${((oldData as NodePatchingData).patcher as NodePatcher).templateString}`);
                }

                newData.node = node;

                newData.rules = rules;
            }
        }
    }
    else if (isNodePatchingData(newPatchingData)) {

        const {
            node,
            rules
        } = oldPatchingData as NodePatchingData;

        if (node === undefined) {

            throw new Error(`Node is required in node patching data: ${((oldPatchingData as NodePatchingData).patcher as NodePatcher).templateString}`);
        }

        (newPatchingData as NodePatchingData).node = node;

        (newPatchingData as NodePatchingData).rules = rules;
    }
}