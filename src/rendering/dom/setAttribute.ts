import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import { ExtensibleHTMLElement } from "../nodes/NodePatchingData";

export default function setAttribute(
    node: ExtensibleHTMLElement,
    attributeName: string,
    propertyName: string,
    value: unknown): void {

    if (isUndefinedOrNull(value) ||
        value === false) {

        node.removeAttribute(attributeName);

        if (attributeName === 'value') {

            (node as unknown as HTMLInputElement).value = '';
        }
        else {

            node[propertyName] = value;
        }
    }
    else {

        const type = typeof value;

        if (type === 'function' ||
            type === 'object') { // This includes arrays too

            node[propertyName] = value; // Bypass the stringification of the attribute

            node.removeAttribute(attributeName); // It is similar to an event. Do not show as attribute
        }
        else { // Any other type

            if (attributeName === 'value') { // Set the value besides setting the attribute

                (node as unknown as HTMLInputElement).value = value as string;
            }

            const v = (value === true) ?
                '' :
                value as string;

            node.setAttribute(attributeName, v);
        }
    }
}

