import isUndefinedOrNull from "../../utils/isUndefinedOrNull";

export default function setAttribute(
    node: HTMLElement & Record<string, any>,
    attributeName: string,
    propertyName: string,
    value: unknown): void {

    if (isUndefinedOrNull(value)) {

        node.removeAttribute(attributeName);

        node[propertyName] = value;
    }
    else {

        const type = typeof value;

        if (type === 'function') {

            node.removeAttribute(attributeName); // It is similar to an event. Do not show as attribute

            node[propertyName] = value; // Bypass the stringification of the attribute
        }
        else if (type === 'object') {

            node.setAttribute(attributeName, JSON.stringify(value));
        }
        else { // Any other type

            if (attributeName === 'value') { // Set the value besides setting the attribute

                (node as HTMLInputElement).value = value as string;
            }

            node.setAttribute(attributeName, value as string);
        }
    }
}

