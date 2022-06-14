/**
 * Returns the first child whose evaluation by predicate returns true
 * @param children 
 * @param predicate 
 * @returns The first HTMLElement for which the predicate function returns true
 */
export default function findChild(children: HTMLCollection, predicate: (element: Element) => boolean) : Element | null {

    if (children.length == 0) {

        return null;
    }

    for (let i = 0; i < children.length; ++i) {

        const child = children[i];

        if (predicate(child) === true) {

            return child;
        }

        const ch = findChild(child.children, predicate);

        if (ch !== null) {

            return ch;
        }      
    }

    return null;
}