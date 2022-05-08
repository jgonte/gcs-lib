import CustomElementMetadata from "../types/CustomElementMetadata";
import CustomElementPropertyMetadata, { ConversionTypes } from "../types/CustomElementPropertyMetadata";
import CustomHTMLElement from "../types/CustomHTMLElement";
import CustomHTMLElementConstructor from "../types/CustomHTMLElementConstructor";

export default function initializeProperties(ctor: CustomHTMLElementConstructor, metadata: CustomElementMetadata): void {

    const properties = getAllProperties(ctor);

    Object.entries(properties).forEach(([key, value]) => initializeProperty(ctor, key, value, metadata));

    // Merge the properties of the base class if any so we can validate and initialize
    // the values of the properties of the base class in the instance
    const baseClass = Object.getPrototypeOf(ctor.prototype)?.constructor;

    if (baseClass !== undefined) {

        const baseClassMetadata = baseClass.metadata;

        if (baseClassMetadata !== undefined) {

            metadata.properties = new Map([...metadata.properties, ...baseClassMetadata.properties]);

            metadata.propertiesByAttribute = new Map([...metadata.propertiesByAttribute, ...baseClassMetadata.propertiesByAttribute]);

            metadata.observedAttributes = [...metadata.observedAttributes, ...baseClassMetadata.observedAttributes];
        }
    }
}

function initializeProperty(ctor: CustomHTMLElementConstructor, name: string, propertyMetadata: CustomElementPropertyMetadata, metadata: CustomElementMetadata): void {

    propertyMetadata.name = name; // Set the name of the property

    // Set the name of the attribute as same as the name of the property if no attribute name was provided
    if (propertyMetadata.attribute === undefined) {

        propertyMetadata.attribute = name;
    }

    Object.defineProperty(
        ctor.prototype,
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

                if (type.includes(ConversionTypes.Function) &&
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

/**
 * Retrieve the state of this and the base mixins
 * @returns The merged state
 */
function getAllProperties(ctor: CustomHTMLElementConstructor,): Record<string, CustomElementPropertyMetadata> {

    let properties = ctor.properties || {};

    let baseClass = Object.getPrototypeOf(ctor.prototype).constructor;

    while (baseClass._isCustomElement === true) {

        if (baseClass.properties !== undefined) {

            properties = { ...properties, ...baseClass.properties };
        }

        baseClass = Object.getPrototypeOf(baseClass.prototype)?.constructor;
    }

    return properties;
}