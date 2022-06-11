import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata, { ConversionTypes } from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import appCtrl from "../../services/appCtrl";
import Kind from "../mixins/Kind";
import { styles } from "./Icon.styles";

const cache = new Map<string, string>();

export default class Icon extends Kind(CustomElement as CustomHTMLElementConstructor) {

    static get styles(): string {

        return mergeStyles(super.styles, styles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the icon
             */
            name: {
                type: ConversionTypes.String,
                required: true
            }
        };
    }

    async render(): Promise<NodePatchingData> {

        const {
            name
        } = this;

        const iconPath = `${appCtrl.iconsPath}${name}.svg`;

        let svg: string | undefined = undefined;

        if (cache.has(iconPath)) {

            svg = cache.get(iconPath);
        }
        else {

            const response = await fetch(iconPath);

            svg = await response.text();

            if (svg.match(/script/i) ||
                svg.match(/onerror/i)) {

                throw new Error(`Potencial XSS threat in file: ${iconPath}`);
            }

            cache.set(iconPath, svg);
        }

        return html([svg] as unknown as TemplateStringsArray);
    }
}

defineCustomElement('wcl-icon', Icon);