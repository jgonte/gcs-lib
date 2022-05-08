import classMetadataRegistry from "../../metadata/classMetadataRegistry";
import CustomElementMetadata from "../../metadata/types/CustomElementMetadata";
import CustomElementPropertyMetadata from "../../metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../metadata/types/CustomHTMLElementConstructor";
import initializeComponent from "../../metadata/initializers/initializeComponent";
import initializeProperties from "../../metadata/initializers/initializeProperties";
import initializeState from "../../metadata/initializers/initializeState";
import initializeStyles from "../../metadata/initializers/initializeStyles";

/**
 * Initializes a web component type (not instance) from the metadata provided
 * @param Base The base class to extend
 * @returns The mixin class
 */
export default function MetadataInitializer<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class MetadataInitializerMixin extends Base {

        static get observedAttributes(): string[] {

            // Initialize the metadata
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

        static get metadata(): CustomElementMetadata {

            const m = classMetadataRegistry.get(this);

            if (m === undefined) {

                throw new Error(`Metadata was not found for component: ${this.name}`);
            }

            return m;
        }
    }
}