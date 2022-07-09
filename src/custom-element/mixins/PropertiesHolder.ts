import { attributeMarkerPrefix } from "../../rendering/template/markers";
import isUndefinedOrNull from "../../utils/isUndefinedOrNull";
import { GenericRecord } from "../../utils/types";
import ensureValueIsInOptions from "./helpers/ensureValueIsInOptions";
import findSelfOrParent from "./helpers/findSelfOrParent";
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
        private _properties: GenericRecord = {};

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
        async didAdoptChildCallback(parent: CustomHTMLElement, child: HTMLElement): Promise<void> {

            const {
                metadata
            } = child.constructor as CustomHTMLElementConstructor;

            if (metadata === undefined) { // Probably not a custom component

                return;
            }

            const {
                properties
            } = metadata;

            await (child as InheritedPropertiesHandler).setInheritedProperties(properties, parent);
        }

        /**
         * Sets the properties that can be inherited from the value of the parent if any
         * @param propertiesMetadata 
         */
        protected async setInheritedProperties(propertiesMetadata: Map<string, CustomElementPropertyMetadata>, parent: CustomHTMLElement): Promise<void> {

            const inheritedProperties = new Map<string, unknown>();

            const setInheritedProperties = (inheritedProperties: Map<string, unknown>) => {

                for (const [name, value] of inheritedProperties) {

                    this.setProperty(name, value);
                }
            }

            for (const [name, property] of propertiesMetadata) {

                const {
                    inherit
                } = property;

                if (inherit !== true) {

                    continue; // Not inheritable
                }

                if (this._initiallyUndefinedProperties.has(name) === false) {

                    continue; // Its value was initially set in the attribute markup
                }

                const selfOrParent = findSelfOrParent(
                    parent,
                    p => !isUndefinedOrNull((p as CustomHTMLElement)[name])
                );

                if (selfOrParent !== null) {

                    //TODO: Subscribe this component to receive notifications when that property changes

                    inheritedProperties.set(name, (selfOrParent as CustomHTMLElement)[name]);
                }
            }

            await setTimeout(() => setInheritedProperties(inheritedProperties), 0); // Wait for the next refresh to set the inherited property
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
        attributeChangedCallback(attributeName: string, oldValue: string | null, newValue: string | null): void {

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

                throw new Error(`Attribute: '${attribute}' is not configured for custom element: '${this.constructor.name}'`);
            }

            const {
                name,
                type
            } = propertyMetadata;

            const v = valueConverter.toProperty(value as string, type); // Convert from the value returned by the parameter

            this.setProperty(name as string, v); // Call the setProperty of the Reactive mixin

            return true;
        }

        _setProperty(name: string, value: unknown): boolean {

            // Verify that the property is one of the configured in the custom element
            const propertyMetadata: CustomElementPropertyMetadata | undefined = (this.constructor as CustomHTMLElementConstructor).metadata?.properties?.get(name);

            if (propertyMetadata === undefined) {

                throw new Error(`Property: '${name}' is not configured for custom element: '${this.constructor.name}'`);
            }

            const {
                attribute,
                reflect,
                options,
                transform
                //afterUpdate - We call afterUpdate after the element was updated in the DOM
            } = propertyMetadata;

            ensureValueIsInOptions(value, options);

            if (transform !== undefined) {

                value = transform.call(this, value); // Transform the data if necessary
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

            this.onPropertyChanged?.(name, value);

            const reflectOnAttribute = reflect === true ? attribute : undefined;

            if (reflectOnAttribute !== undefined) { // Synchronize with the attribute of the element

                value = valueConverter.toAttribute(value);

                if (isUndefinedOrNull(value)) {

                    this.removeAttribute(reflectOnAttribute);
                }
                else {

                    this.setAttribute(reflectOnAttribute, value as string); // This will trigger the attributeChangedCallback
                }
            }

            this._changedProperties.set(name, propertyMetadata);

            return true;
        }

        /**
         * Calls the afterUpdate method of any changed property if defined
         */
        protected callAfterUpdate() {

            this._changedProperties.forEach(p => {

                if (p.afterUpdate !== undefined) {

                    p.afterUpdate.call(this);
                }
            });
        }

        clearChangedProperties() {

            this._changedProperties.clear();
        }
    }
}