import CustomHTMLElementConstructor from "../types/CustomHTMLElementConstructor";
import CustomElementMetadata from "../types/CustomElementMetadata";
import CustomElementStateMetadata from "../types/CustomElementStateMetadata";
import CustomHTMLElement from "../types/CustomHTMLElement";

export default function initializeState(ctor: CustomHTMLElementConstructor, metadata: CustomElementMetadata): void {

    const state = getAllState(ctor);

    Object.entries(state).forEach(([name, stateMetadata]) => {

        (stateMetadata as CustomElementStateMetadata).name = name; // Set the name of the state property

        Object.defineProperty(
            ctor.prototype,
            name,
            {
                get(): unknown {

                    return this._state[name];
                },
                set(this: CustomHTMLElement, value: unknown) {

                    this.setState(name, value);
                },
                configurable: true,
                enumerable: true,
            }
        );

        // Add it to the metadata properties so the properties of the instances can be validated and initialized
        metadata.state.set(name, stateMetadata as CustomElementStateMetadata);
    });

    // Add the properties of the state base class if any so we can validate and initialize
    // the values of the properties of the state of the base class in the instance
    const baseClass = Object.getPrototypeOf(ctor.prototype).constructor;

    if (baseClass !== undefined) {

        const baseClassMetadata = baseClass.metadata;

        if (baseClassMetadata !== undefined) {

            metadata.state = new Map([...metadata.state, ...baseClassMetadata.state]);
        }
    }
}

/**
 * Retrieve the state of this and the base mixins
 * @returns The merged state
 */
function getAllState(ctor: CustomHTMLElementConstructor, ): Record<string, CustomElementStateMetadata> {

    let state = ctor.state || {};

    let baseClass = Object.getPrototypeOf(ctor.prototype).constructor;

    while (baseClass.isCustomElement === true) {

        if (baseClass.state !== undefined) {

            state = { ...state, ...baseClass.state };
        }

        baseClass = Object.getPrototypeOf(baseClass.prototype)?.constructor;
    }

    return state;
}
