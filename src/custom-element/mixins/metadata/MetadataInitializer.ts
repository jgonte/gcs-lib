import CustomHTMLElementConstructor from "./types/CustomHTMLElementConstructor";
import classMetadataRegistry from "./classMetadataRegistry";
import CustomElementMetadata from "./types/CustomElementMetadata";
import CustomElementPropertyMetadata from "./types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "./types/CustomElementStateMetadata";
import initializeComponent from "./initializers/initializeComponent";
import initializeProperties from "./initializers/initializeProperties";
import initializeState from "./initializers/initializeState";
import initializeStyles from "./initializers/initializeStyles";

/**
 * Initializes a web component type (not instance) from the metadata provided
 * @param Base The base class to extend
 * @returns The mixin class
 */
export default function MetadataInitializer<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class MetadataInitializerMixin extends Base {

        static get observedAttributes(): string[] {

            // Initialize the metadata for this (derived) custom element
            if (!classMetadataRegistry.has(this)) {

                classMetadataRegistry.set(this, {
                    properties: new Map<string, CustomElementPropertyMetadata>(),
                    propertiesByAttribute: new Map<string, CustomElementPropertyMetadata>(),
                    observedAttributes: [],
                    state: new Map<string, CustomElementStateMetadata>(),
                    styles: undefined,
                    shadow: true
                });
            }

            const {
                metadata
            } = this;

            initializeComponent(this, metadata);

            initializeProperties(this, metadata);

            initializeState(this, metadata);

            initializeStyles(this, metadata);

            return metadata.observedAttributes;
        }

        /**
         * Retrieves the metadata for the given custom element
         * It returns undefined for the base CustomElement so we know when to stop merging the properties
         */
        static get metadata(): CustomElementMetadata | undefined {

            return classMetadataRegistry.get(this);
        }
    }
}