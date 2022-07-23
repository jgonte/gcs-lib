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

        // undefined means not initialized yet, null means it does not have any custom element as a parent
        private _adoptingParent: ParentNode | null | undefined = undefined;

        /**
         * The children elements of this one
         */
        /* protected */ adoptedChildren: Set<Node> = new Set<Node>();

        async connectedCallback(): Promise<void> {

            super.connectedCallback?.();

            const adoptingParent = await this.getAdoptingParent();

            if (adoptingParent === null) { // In slotted elements the parent is null when connected

                return;
            }

            (adoptingParent as CustomHTMLElement).adoptedChildren.add(this); // It might be null for the topmost custom element

            this.didAdoptChildCallback?.(adoptingParent as CustomHTMLElement, this);
        }

        async disconnectedCallback(): Promise<void> {

            super.disconnectedCallback?.();

            const adoptingParent = await this.getAdoptingParent();

            if (adoptingParent === null) {

                return;
            }

            this.willAbandonChildCallback?.(adoptingParent as CustomHTMLElement, this);

            (adoptingParent as ParentChildMixin).adoptedChildren.delete(this); // It might be null for the topmost custom element
        }

        async didMountCallback(): Promise<void> {

            await super.didMountCallback?.();

            // Add the slotted children
            const slot = (this.document as HTMLElement).querySelector('slot');

            if (slot === null) { // There is no slot to get the children from

                const adoptingParent = await this.getAdoptingParent();

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

        /**
         * Retrieves the parent that is a custom element up in the hierarchy
         * @returns 
         */
        protected async getAdoptingParent(): Promise<Node | null> {

            if (this._adoptingParent === undefined) { // Memoize

                let parent = this.parentNode;

                while (parent !== null) {

                    if (parent instanceof DocumentFragment) { // Possibly a shadow DOM

                        parent = (parent as ShadowRoot).host; // Get its host
                    }

                    const tagName = (parent as HTMLElement).tagName?.toLowerCase();

                    if (tagName === 'body') { // Top parent

                        return this._adoptingParent = null;
                    }

                    if (tagName.startsWith('wcl-')) {

                        await window.customElements.whenDefined(tagName);
                    }

                    if ((parent.constructor as CustomHTMLElementConstructor)._isCustomElement === true) {  // It is a custom element

                        return this._adoptingParent = parent;
                    }

                    parent = parent.parentNode;
                }
            }

            return this._adoptingParent as Node;
        }

        handleSlotchange(e: Event): void {

            console.dir(e);

            alert('kuku');
        }
    }
}