import CustomHTMLElement from "./metadata/types/CustomHTMLElement";
import CustomHTMLElementConstructor from "./metadata/types/CustomHTMLElementConstructor";

/**
 * Establishes a relationship between a parent custom element and its children to
 * allow the parent to manage them
 * @param Base 
 * @returns 
 */
export default function ParentChild<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class ParentChildMixin extends Base {

        private _adoptingParent: ParentNode | null = null;

        /**
         * The children elements of this one
         */
        /* protected */ adoptedChildren: Set<Node> = new Set<Node>();

        connectedCallback() {

            super.connectedCallback?.();

            const {
                adoptingParent
            } = this;

            if (adoptingParent === null) { // In slotted elements the parent is null when connected

                return;
            }

            (adoptingParent as CustomHTMLElement).adoptedChildren.add(this); // It might be null for the topmost custom element

            this.didAdoptChildCallback?.(adoptingParent as CustomHTMLElement, this);
        }

        disconnectedCallback(): void {

            super.disconnectedCallback?.();

            const {
                adoptingParent
            } = this;

            if (adoptingParent === null) {

                return;
            }

            this.willAbandonChildCallback?.(adoptingParent as CustomHTMLElement, this);

            (adoptingParent as ParentChildMixin).adoptedChildren.delete(this); // It might be null for the topmost custom element
        }

        didMountCallback(): void {

            super.didMountCallback?.();

            // Add the slotted children
            const slot = (this.document as HTMLElement).querySelector('slot');

            if (slot === null) { // There is no slot to get the children from

                const {
                    adoptingParent
                } = this;

                if (adoptingParent !== null) {

                    (adoptingParent as CustomHTMLElement).adoptedChildren.add(this); // It might be null for the topmost custom element

                    this.didAdoptChildCallback?.(adoptingParent as CustomHTMLElement, this);
                }

                return; // Nothing to do with the slot
            }

            const children = slot.assignedNodes();

            if (children.length > 0) { // The children have been already loaded

                children.forEach((child) => {

                    this.adoptedChildren.add(child);

                    this.didAdoptChildCallback?.(this as CustomHTMLElement, child as HTMLElement);
                });
            }
            else { // Listen for any change in the slot

                slot.addEventListener('slotchange', (this as CustomHTMLElement).handleSlotChange);
            }

            const {
                adoptedChildren
            } = this;

            if (adoptedChildren.size > 0) {

                this.didAdoptChildrenCallback?.(this, adoptedChildren);
            }
        }

        protected get adoptingParent(): Node | null {

            if (this._adoptingParent === null) {

                let parent = this.parentNode;

                while (parent !== null) {

                    if ((parent.constructor as CustomHTMLElementConstructor)._isCustomElement === true) {  // It is a custom element

                        break;
                    }

                    parent = parent.parentNode;
                }

                this._adoptingParent = parent;
            }

            return this._adoptingParent;
        }
    }
}