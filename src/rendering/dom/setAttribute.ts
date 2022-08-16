import isCustomElement from "../../custom-element/isCustomElement";
import CustomHTMLElement from "../../custom-element/mixins/metadata/types/CustomHTMLElement";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import { GenericRecord } from "../../utils/types";
import { ExtensibleHTMLElement } from "../nodes/NodePatchingData";

export default function setAttribute(
	node: ExtensibleHTMLElement,
	attributeName: string,
	propertyName: string,
	value: unknown
): void {

	// If the node is a custom element but not initialized yet, then set the temporary properties to call them in the constructor to initialize the final properties
	if (isCustomElement(node) &&
		node.isInitialized !== true) {

		node._$tempProperties ??= {};

		((node as CustomHTMLElement)._$tempProperties as GenericRecord)[propertyName] = value;

		return;
	}

	// Here the custom element is initialized, set the attribute/property according to the type of the value and configuration
	if (isUndefinedOrNull(value) || value === false) {

		node.removeAttribute(attributeName);

		if (attributeName === "value") {

			node.value = "";
		}
		else {

			node[propertyName] = value;
		}
	}
	else {

		// If we are here that means that the noide has been already initialized
		const type = typeof value;

		if (type === "function" ||
			type === "object") { // This includes arrays too

			node[propertyName] = value; // Bypass the stringification of the attribute

			node.removeAttribute(attributeName); // It is similar to an event. Do not show as attribute
		}
		else { // Any other type

			if (attributeName === "value") { // Set the value besides setting the attribute

				(node as unknown as HTMLInputElement).value = value as string;
			}

			const v = value === true ? "" : (value as string);

			node.setAttribute(attributeName, v);
		}
	}
}
