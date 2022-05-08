import CustomHTMLElement from "../metadata/types/CustomHTMLElement";

export default function findParentPropertyValue(element: CustomHTMLElement, name: string): unknown {

    let parent: CustomHTMLElement | null = element;

    do {

        const value = parent[name];

        if (value !== undefined &&
            value !== '') {

            return value;
        }

        parent = parent.parentElement as CustomHTMLElement;

    } while (parent != null);

    return undefined;
}