import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";

export default function renderTip(kind: string, trigger: string, resourceKey: string, text: string = ''): NodePatchingData {

    return html`<wcl-tool-tip>
        <wcl-pill kind=${kind} slot="trigger">${trigger}</wcl-pill>
        <wcl-localized-text resource-key=${resourceKey} slot="content">${text}</wcl-localized-text>
    </wcl-tool-tip>`;
}