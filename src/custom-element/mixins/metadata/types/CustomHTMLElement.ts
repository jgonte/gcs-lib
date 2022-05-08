import { NodePatchingData } from "../../../../rendering/nodes/NodePatchingData";

/**
 * Defines the additional members of the CustomHTMLElement
 */
export default interface CustomHTMLElement extends HTMLElement {

    /**
     * Indexer for the properties and state
     */
    // The values of properties and state can be of any type. Restricting the value causes error with other indexers of the HTMLElement
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    [index: string]: any;

    // Custom element lifecycle
    connectedCallback(): void;

    disconnectedCallback(): void;

    attributeChangedCallback(attributeName: string, oldValue: string | null, newValue: string | null): void;

    // DOM patching

    render(): NodePatchingData | NodePatchingData[] | null;

    beforeRender(patchingData: NodePatchingData | NodePatchingData[]): NodePatchingData | NodePatchingData[];

    get document(): HTMLElement | ShadowRoot;

    // DOM patching lifecycle

    didMountCallback(): void;

    willUpdateCallback(): void;

    didUpdateCallback(): void;

    willUnmountCallback(): void;

    // Reactive

    setProperty(name: string, value: unknown): void;

    setState(name: string, value: unknown): void;

    /**
     * Whether the styles were already added to the document
     */
    stylesAdded: boolean;

    // Parent-Child
    adoptedChildren: Set<Node>;

    didAdoptChildCallback(parent: CustomHTMLElement, child: HTMLElement): void;

    didAdoptChildrenCallback(parent: CustomHTMLElement, children: Set<Node>): void;

    willAbandonChildCallback(parent: CustomHTMLElement, child: HTMLElement): void;

    handleSlotChange: EventListenerOrEventListenerObject;

    
    // Whished protected
    _setProperty(name: string, value: unknown): boolean;

    _setState(name: string, value: unknown): boolean;

    clearChangedProperties(): void;

    updateDom(): void;

    get updateComplete(): Promise<void>;
}