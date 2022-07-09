import CustomHTMLElement from "../metadata/types/CustomHTMLElement";

/**
 * Returns the first parent element whose satisfies the predicate (it returns true)
 * @param element 
 * @param predicate 
 * @returns The first parent element for which the predicate function returns true
 */
export default function findSelfOrParent(element: Element, predicate: (element: Element) => boolean) : Element | null {

    let parent = element;

    do {

        if (predicate(parent) === true) {

            return parent;
        }

        parent = parent.parentElement as CustomHTMLElement;

    } while (parent !== null);

    return null;
}