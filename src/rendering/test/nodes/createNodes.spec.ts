import html from "../../html";
import createNodes from "../../nodes/createNodes";
import { AnyPatchedNode } from "../../nodes/NodePatchingData";
import { beginMarker, endMarker } from "../../template/markers";

describe("create nodes tests", () => {

    it('should create a text node (with a begin and end placeholders)', () => {

        const name = 'Sarah';

        const patchingData = html`${name}`;

        const df = createNodes(patchingData);

        const {
            childNodes
        } = df;

        expect(childNodes.length).toEqual(3);

        let comment = childNodes[0] as Comment;

        expect(comment.nodeType).toEqual(Node.COMMENT_NODE);

        expect(comment.data).toEqual(beginMarker);

        // The first node always has the patching data
        expect((comment as unknown as AnyPatchedNode)._$patchingData).toEqual(patchingData);

        const text = childNodes[1] as Text;

        expect(text.nodeType).toEqual(Node.TEXT_NODE);

        expect(text.textContent).toEqual('Sarah');

        comment = childNodes[2] as Comment;

        expect(comment.nodeType).toEqual(Node.COMMENT_NODE);

        expect(comment.data).toEqual(endMarker);
    });

});