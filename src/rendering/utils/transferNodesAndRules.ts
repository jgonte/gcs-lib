import { NodePatchingData } from "../nodes/NodePatchingData";
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

                newData.node = oldData.node;

                newData.rules = oldData.rules;
            }
        }
    }
    else if (isNodePatchingData(newPatchingData)) {

        (newPatchingData as NodePatchingData).node = (oldPatchingData as NodePatchingData).node;

        (newPatchingData as NodePatchingData).rules = (oldPatchingData as NodePatchingData).rules;
    }
}