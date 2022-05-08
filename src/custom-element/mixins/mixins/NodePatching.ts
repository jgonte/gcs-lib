import mountNodes from "../../../rendering/nodes/mountNodes";
import { NodePatchingData } from "../../../rendering/nodes/NodePatchingData";
import updateNodes from "../../../rendering/nodes/updateNodes";
import CustomHTMLElement from "../metadata/types/CustomHTMLElement";
import CustomHTMLElementConstructor from "../metadata/types/CustomHTMLElementConstructor";

/**
 * Updates the element by patching the nodes
 * @param Base 
 * @returns 
 */
export default function NodePatching<TBase extends CustomHTMLElementConstructor>(Base: TBase) : TBase {

    return class NodePatchingMixin extends Base {

        /**
         * The old patching node data to patch against
         */
        private _oldPatchingData: NodePatchingData | NodePatchingData[] | null = null;

        /* protected */ updateDom() {

            let newPatchingData: NodePatchingData | NodePatchingData[] | null = this.render();

            if (newPatchingData !== null) { // Only if there is something to render

                newPatchingData = this.beforeRender(newPatchingData); // Modify the original patching data if needed
            }

            const {
                document,
                _oldPatchingData
            } = this;

            if (_oldPatchingData === null) {

                if (newPatchingData !== null) { // Mount

                    mountNodes(document, newPatchingData);

                    this._waitForChildrenToMount();
                }
                // else newPatchingData === null - Nothing to do
            }
            else { // this._oldPatchingData !== null

                if (newPatchingData !== null) { // Update

                    this.willUpdateCallback?.();

                    updateNodes(document, _oldPatchingData, newPatchingData);

                    this._waitForChildrenToUpdate();
                }
                else { // newPatchingData === null - Unmount

                    this.willUnmountCallback?.();

                    (this.document as HTMLElement).replaceChildren(); // Remove all the existing children

                    this.stylesAdded = false; // Need to re-add the styles
                }
            }

            this._oldPatchingData = newPatchingData;
        }

        /**
         * Wait for the children to mount before this (parent)
         */
        private async _waitForChildrenToMount() {

            const updatePromises = [...this.adoptedChildren].map(child => (child as CustomHTMLElement).updateComplete);

            if (updatePromises.length > 0) {

                await Promise.all(updatePromises);
            }

            this.didMountCallback?.();
        }

        /**
         * Wait for the children to update before this (parent)
         */
        private async _waitForChildrenToUpdate() {

            const updatePromises = [...this.adoptedChildren].map(child => (child as CustomHTMLElement).updateComplete);

            if (updatePromises.length > 0) {

                await Promise.all(updatePromises);
            }

            this.didUpdateCallback?.();
        }
    }
}