import { attributeMarkerPrefix } from "../../rendering/template/markers";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import findParentPropertyValue from "./helpers/findParentPropertyValue";
import valueConverter from "./helpers/valueConverter";
import CustomElementPropertyMetadata from "./metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElement from "./metadata/types/CustomHTMLElement";
import CustomHTMLElementConstructor from "./metadata/types/CustomHTMLElementConstructor";

/**
 * The protected members
 */
interface InheritedPropertiesHandler extends CustomHTMLElement {

    setInheritedProperties(propertiesMetadata: Map<string, CustomElementPropertyMetadata>, parent: CustomHTMLElement): void;
}

/**
 * Sets up the properties of the custom element
 * @param Base 
 * @returns 
 */
export default function PropertiesHolder<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class PropertiesHolderMixin extends Base {

        /**
        * The properties of the instance
        */
        private _properties: Record<string, unknown> = {};

        /**
         * Map of the metadata of the changed properties so that the "afterUpdate" method can be called on the property after the update of the DOM
         */
        private _changedProperties: Map<string, CustomElementPropertyMetadata> = new Map<string, CustomElementPropertyMetadata>();

        /**
         * The properties that by the time the component gets connected, do not have any attribute explicitly set in the markup
         */
        private _initiallyUndefinedProperties: Set<string> = new Set<string>();

        connectedCallback() {

            super.connectedCallback?.();

            const {
                properties
            } = (this.constructor as CustomHTMLElementConstructor).metadata;

            this._initializeDefaultProperties(properties);

            this._validateRequiredProperties(properties);
        }

        /**
         * Initializes the properties that have a default value
         * @param propertiesMetadata 
         */
        private _initializeDefaultProperties(propertiesMetadata: Map<string, CustomElementPropertyMetadata>) {

            for (const [name, property] of propertiesMetadata) {

                const {
                    value
                } = property;

                if (this._properties[name] === undefined) { // Not explicitly set

                    this._initiallyUndefinedProperties.add(name);

                    if (value !== undefined) { // Set the default value

                        this.setProperty(name, value);
                    }
                }
            }
        }

        /**
         * Validates that all the required properties have been set
         * @param propertiesMetadata 
         */
        private _validateRequiredProperties(propertiesMetadata: Map<string, CustomElementPropertyMetadata>) {

            const missingValueAttributes: string[] = [];

            propertiesMetadata.forEach(p => {
                const {
                    required,
                    attribute
                } = p;

                if (required === true &&
                    ((this.attributes as unknown as Record<string, string>)[attribute as string] === undefined &&
                        this[attribute as string] === undefined)) { // The attribute for that property has not been set

                    missingValueAttributes.push(attribute as string);
                }
            });

            if (missingValueAttributes.length > 0) {

                throw Error(`The attributes: [${missingValueAttributes.join(', ')}] must have a value`);
            }
        }

        /**
         * Called when the component added a child or it was added as a child
         * @param parent 
         * @param child 
         */
        didAdoptChildCallback(parent: CustomHTMLElement, child: HTMLElement): void {

            const {
                metadata
            } = child.constructor as CustomHTMLElementConstructor;

            if (metadata === undefined) { // Probably not a custom component

                return;
            }

            const {
                properties
            } = metadata;

            (child as InheritedPropertiesHandler).setInheritedProperties(properties, parent);
        }

        /**
         * Sets the properties that can be inherited from the value of the parent if any
         * @param propertiesMetadata 
         */
        protected setInheritedProperties(propertiesMetadata: Map<string, CustomElementPropertyMetadata>, parent: CustomHTMLElement) {

            for (const [name, property] of propertiesMetadata) {

                const {
                    value,
                    inherit
                } = property;

                if (inherit !== true) {

                    continue; // Not inheritable
                }

                if (this._initiallyUndefinedProperties.has(name) === false) {

                    continue; // Its value was initially set in the attribute markup
                }

                const parentValue = findParentPropertyValue(parent, name);

                if (parentValue !== undefined) {

                    this.setProperty(name, parentValue);
                }
                else if (this[name] !== value) { // It is different from the default value

                    this.setProperty(name, parentValue);
                }
            }
        }

        // Without defining this method, the observedAttributes getter will not be called
        // Also no need to check that the property was configured because if it is not configured, 
        // it will not generate the observedAttribute and therefore this method won't be called for that attribute
        /**
         * Called when there is a change in an attribute
         * @param attributeName
         * @param oldValue 
         * @param newValue 
         */
        attributeChangedCallback(attributeName: string, oldValue: string | null, newValue: string | null) {

            if (oldValue === newValue) {

                return; // Nothing to change
            }

            super.attributeChangedCallback?.(attributeName, oldValue, newValue);

            this._setAttribute(attributeName, newValue);
        }

        // /**
        //  * Overrides the parent method to verify that it is accessing a configured property
        //  * @param attribute 
        //  * @param value 
        //  */
        // setAttribute(attribute: string, value: any) {

        //     // Verify that the property is one of the configured in the custom element
        //     if ((this.constructor as any)._propertiesByAttribute[attribute] === undefined &&
        //         !(this.constructor as any).metadata.htmlElementProperties.has(attribute)) {

        //         throw Error(`There is no configured property for attribute: '${attribute}' in type: '${this.constructor.name}'`)
        //     }

        //     super.setAttribute(attribute, value);
        // }

        private _setAttribute(attribute: string, value: string | null): boolean {

            if (value !== null &&
                value.startsWith(attributeMarkerPrefix)) { // Coming from a template ... ignore

                return false;
            }

            // Verify that the property is one of the configured in the custom element
            const propertyMetadata: CustomElementPropertyMetadata | undefined = (this.constructor as CustomHTMLElementConstructor).metadata.propertiesByAttribute.get(attribute);

            if (propertyMetadata === undefined) {

                throw new Error(`Attribute: ${attribute} is not configured for custom element: ${this.constructor.name}`);
            }

            const {
                name,
                type,
                transform
            } = propertyMetadata;

            let v = valueConverter.toProperty(value as string, type); // Convert from the value returned by the parameter

            if (transform !== undefined) {

                v = transform.call(this, v); // Transform the data if necessary
            }

            return this._setProperty(name as string, v);
        }

        _setProperty(name: string, value: unknown): boolean {

            // Verify that the property is one of the configured in the custom element
            const propertyMetadata: CustomElementPropertyMetadata | undefined = (this.constructor as CustomHTMLElementConstructor).metadata?.properties?.get(name);

            if (propertyMetadata === undefined) {

                throw new Error(`Property: ${name} is not configured for custom element: ${this.constructor.name}`);
            }

            const oldValue = this._properties[name];

            if (oldValue === value) {

                return false;
            }

            if (typeof value === 'function') {

                this._properties[name] = (value as (...args: unknown[]) => unknown).bind(this);
            }
            else {

                this._properties[name] = value;
            }

            const {
                attribute,
                reflect,
                options
                //afterUpdate - We call afterUpdate after the element was updated in the DOM
            } = propertyMetadata;

            if (options !== undefined &&
                !options.includes(value)) {

                throw new Error(`Value: ${value} is not part of the options: [${options.join(', ')}]`);
            }

            const reflectOnAttribute = reflect === true ? attribute : undefined;

            if (reflectOnAttribute !== undefined) { // Synchronize with the attribute of the element

                value = valueConverter.toAttribute(value);

                if (isUndefinedOrNull(value) ||
                    value === '') {

                    this.removeAttribute(reflectOnAttribute);
                }
                else {

                    // This will trigger the attributeChangedCallback
                    this.setAttribute(reflectOnAttribute, value as string);
                }
            }

            this._changedProperties.set(name, propertyMetadata);

            return true;
        }

        protected callAttributesChange() {

            this._changedProperties.forEach(p => {

                if (p.afterUpdate !== undefined) { // Call the change function if defined

                    p.afterUpdate.call(this);
                }
            });
        }

        clearChangedProperties() {

            this._changedProperties.clear();
        }
    }
}