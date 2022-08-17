import CustomHTMLElementConstructor from "./mixins/metadata/types/CustomHTMLElementConstructor";
import ParentChild from "./mixins/ParentChild";
import ReactiveElement from "./mixins/ReactiveElement";
import StylesPatching from "./mixins/StylesPatching";
import NodePatching from "./mixins/NodePatching";
import ShadowRoot from "./mixins/ShadowRoot";
import MetadataInitializer from "./mixins/metadata/MetadataInitializer";
import { RenderReturnTypes } from "./mixins/metadata/types/CustomHTMLElement";
import { GenericRecord } from "../utils/types";

/**
 * The base class for all the custom elements
 */
export default abstract class CustomElement extends ParentChild(
	ReactiveElement(
		StylesPatching(
			NodePatching(
				ShadowRoot(
					MetadataInitializer(HTMLElement as CustomHTMLElementConstructor)
				)
			)
		)
	)
) {
	/**
	 * Flag to allow testing for derived classes of CustomElement
	 */
	static readonly isCustomElement: boolean = true;

	constructor() {

		super();
		
		this.initialized?.(this); // Call the initialized property if any

		this.isInitialized = true; // Flag the element as initialized
	}

	/**
	 * The render method that needs to be implemented by the derived elements
	 */
	abstract render(): RenderReturnTypes;

	dispatchCustomEvent(type: string, detail: GenericRecord): void {
		setTimeout(() => { // Repaint before dispatching the event

			this.dispatchEvent(
				new CustomEvent(type, {
					detail: detail,
					bubbles: true,
					composed: true, // To bubble through the shadow DOM
				})
			);

			console.log(
`Event of type: '${type}' was dispatched with detail: 
${console.dir(detail)}
`);
		}, 0);
	}
}
