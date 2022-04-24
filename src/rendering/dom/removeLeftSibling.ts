export default function removeLeftSibling(markerNode: Node): void {

    const {
        parentNode,
        previousSibling
    } = markerNode;

    parentNode!.removeChild(previousSibling!);
}