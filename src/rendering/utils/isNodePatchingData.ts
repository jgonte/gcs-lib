import { NodePatchingData } from "../nodes/NodePatchingData";

export default function isNodePatchingData(o: unknown) : boolean {

    return (o as NodePatchingData).patcher !== undefined;
}