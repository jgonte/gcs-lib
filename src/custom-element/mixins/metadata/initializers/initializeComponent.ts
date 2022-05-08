import CustomElementMetadata from "../types/CustomElementMetadata";
import CustomHTMLElementConstructor from "../types/CustomHTMLElementConstructor";

export default function initializeComponent(ctor: CustomHTMLElementConstructor, metadata: CustomElementMetadata): void {

    const {
        component
    } = ctor;

    if (component === undefined) {

        metadata.shadow = true; // It is true by default

        return;
    }

    metadata.shadow = component.shadow;
}