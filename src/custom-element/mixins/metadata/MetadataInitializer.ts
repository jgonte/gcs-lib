import CustomHTMLElementConstructor from "./types/CustomHTMLElementConstructor";
import classMetadataRegistry from "./classMetadataRegistry";
import CustomElementMetadata from "./types/CustomElementMetadata";
import CustomElementPropertyMetadata from "./types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "./types/CustomElementStateMetadata";
import initializeComponent from "./initializers/initializeComponent";
import initializeState from "./initializers/initializeState";
import initializeStyles from "./initializers/initializeStyles";
import { DataTypes } from "../../../utils/data/DataTypes";
import CustomHTMLElement from "./types/CustomHTMLElement";

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

            this.initializeProperties(metadata);

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

        static initializeProperties(metadata: CustomElementMetadata): void {

            const properties = this.getAllProperties();

            Object.entries(properties).forEach(([key, value]) => this.initializeProperty(key, value, metadata));

            // Merge the properties of the base class if any so we can validate and initialize
            // the values of the properties of the base class in the instance
            const baseClass = Object.getPrototypeOf(this.prototype)?.constructor;

            if (baseClass !== undefined) {

                const baseClassMetadata = baseClass.metadata;

                if (baseClassMetadata !== undefined) {

                    metadata.properties = new Map([...metadata.properties, ...baseClassMetadata.properties]);

                    metadata.propertiesByAttribute = new Map([...metadata.propertiesByAttribute, ...baseClassMetadata.propertiesByAttribute]);

                    metadata.observedAttributes = [...metadata.observedAttributes, ...baseClassMetadata.observedAttributes];
                }
            }
        }

        /**
         * Retrieve the state of this and the base mixins
         * @returns The merged state
         */
        static getAllProperties(): Record<string, CustomElementPropertyMetadata> {

            let properties = this.properties || {};

            let baseClass = Object.getPrototypeOf(this.prototype).constructor;

            while (baseClass._isCustomElement === true) {

                if (baseClass.properties !== undefined) {

                    properties = { ...properties, ...baseClass.properties };
                }

                baseClass = Object.getPrototypeOf(baseClass.prototype)?.constructor;
            }

            return properties;
        }

        static initializeProperty(name: string, propertyMetadata: CustomElementPropertyMetadata, metadata: CustomElementMetadata): void {

            propertyMetadata.name = name; // Set the name of the property

            // Set the name of the attribute as same as the name of the property if no attribute name was provided
            if (propertyMetadata.attribute === undefined) {

                propertyMetadata.attribute = name;
            }

            Object.defineProperty(
                this.prototype,
                name,
                {
                    get(): unknown {

                        let {
                            type
                        } = propertyMetadata;

                        const {
                            defer
                        } = propertyMetadata;

                        const value = this._properties[name];

                        if (!Array.isArray(type)) {

                            type = [type];
                        }

                        if (type.includes(DataTypes.Function) &&
                            typeof value === 'function' &&
                            defer !== true) { // Only call the function if the type is a Function and it is not deferred

                            return value();
                        }

                        return value;
                    },
                    set(this: CustomHTMLElement, value: unknown) {

                        this.setProperty(name, value);
                    },
                    configurable: true,
                    enumerable: true,
                }
            );

            // Add it to the metadata properties so the properties of the instances can be validated and initialized
            metadata.properties.set(name, propertyMetadata);

            const {
                attribute
            } = propertyMetadata;

            // Index the property descriptor by the attribute name
            metadata.propertiesByAttribute.set(attribute, propertyMetadata); // Index by attribute name

            // Add the observed attribute
            metadata.observedAttributes.push(propertyMetadata.attribute.toLowerCase());
        }
    }
}