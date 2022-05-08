import CustomElementMetadata from "../types/CustomElementMetadata";
import CustomHTMLElementConstructor from "../types/CustomHTMLElementConstructor";

export default function initializeStyles(ctor: CustomHTMLElementConstructor, metadata: CustomElementMetadata): void {

    const {
        styles
    } = ctor;

    if (styles === undefined) {

        return;
    }

    // Do not inherit the styles of the base custom element by default
    // metadata.styles = Array.isArray(styles) ?
    //     [...metadata.styles, ...styles] :
    //     [...metadata.styles, styles];

    metadata.styles = styles;
}