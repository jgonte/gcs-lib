import CustomHTMLElementConstructor from "./mixins/metadata/types/CustomHTMLElementConstructor";
import ParentChild from "./mixins/ParentChild";
import ReactiveElement from "./mixins/ReactiveElement";
import StylesPatching from "./mixins/StylesPatching";
import NodePatching from "./mixins/NodePatching";
import ShadowRoot from "./mixins/ShadowRoot";
import MetadataInitializer from "./mixins/metadata/MetadataInitializer";
import { RenderReturnTypes } from "./mixins/metadata/types/CustomHTMLElement";

/**
 * The base class for all the custom elements
 */
export default abstract class CustomElement extends
    ParentChild(
        ReactiveElement(
            StylesPatching(
                NodePatching(
                    ShadowRoot(
                        MetadataInitializer(
                            HTMLElement as CustomHTMLElementConstructor
                        )
                    )
                )
            )
        )
    ) {

    /**
     * Flag to allow testing for derived classes of CustomElement
     */
    static readonly _isCustomElement: boolean = true;

    /**
     * The render method that needs to be implemented by the derived elements
     */
    abstract render(): RenderReturnTypes;
}
