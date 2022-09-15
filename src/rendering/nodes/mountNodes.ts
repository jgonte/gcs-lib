import NodePatcher from "../patcher/NodePatcher";
import isNodePatchingData from "../utils/isNodePatchingData";
import createNodes from "./createNodes";
import { NodePatchingData } from "./NodePatchingData";

export default function mountNodes(container: Node, patchingData: NodePatchingData | NodePatchingData[]) {

    if (Array.isArray(patchingData)) {

        patchingData.forEach(pd => {

            const n = createNodes(pd);

            if (isNodePatchingData(pd) &&
                (pd as NodePatchingData).node === undefined) {

                throw new Error(`Node is required in node patching data: ${((pd as NodePatchingData).patcher as NodePatcher).templateString}`);
            }

            container.appendChild(n);
        });
    }
    else {

        const n = createNodes(patchingData);

            if (isNodePatchingData(patchingData) &&
                (patchingData as NodePatchingData).node === undefined) {

                throw new Error(`Node is required in node patching data: ${((patchingData as NodePatchingData).patcher as NodePatcher).templateString}`);
            }

            container.appendChild(n);
    }
}