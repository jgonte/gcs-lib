import defineCustomElement from "../../custom-element/defineCustomElement";
import mergeStyles from "../../custom-element/styles/mergeStyles";
//import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
//import { DataTypes } from "../../utils/data/DataTypes";
import { pillStyles } from "./Pill.styles";
import Nuanced from "../Nuanced";

export default class Pill extends Nuanced {

    static get styles(): string {

        return mergeStyles(super.styles, pillStyles);
    }

    // static get properties(): Record<string, CustomElementPropertyMetadata> {

    //     return {

    //         /**
    //          * Content justification
    //          */
    //         justifyContent: {
    //             attribute: 'justify-content',
    //             type: DataTypes.String,
    //             value: 'space-between',
    //             options: ['start', 'center', 'end', 'space-around', 'space-between', 'space-evenly'],
    //             reflect: true
    //         }
    //     };
    // }

    render(): NodePatchingData {

        return html`<slot></slot>`;
    }
}

defineCustomElement('wcl-pill', Pill);