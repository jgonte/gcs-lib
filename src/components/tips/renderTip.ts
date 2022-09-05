import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";

export default function renderTip(kind: string, trigger: string, intlKey: string, text: string = ''): NodePatchingData {

    return html`<wcl-tool-tip>
        <wcl-pill kind=${kind} slot="trigger">${trigger}</wcl-pill>
        <wcl-localized-text intl-key=${intlKey} slot="content">${text}</wcl-localized-text>
    </wcl-tool-tip>`;
}