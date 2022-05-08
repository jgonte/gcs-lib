import CustomElementStateMetadata from "./metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "./metadata/types/CustomHTMLElementConstructor";

/**
 * Sets up the state of the custom element
 * @param Base 
 * @returns 
 */
export default function StateHolder<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class StateHolderMixin extends Base {

        /**
         * The state of the instance
         */
        private _state: Record<string, unknown> = {};

        connectedCallback() {

            super.connectedCallback?.();

            this._initializeStateWithDefaultValues((this.constructor as CustomHTMLElementConstructor).metadata.state);
        }

        /**
         * Initializes the state that have a default value
         * @param stateMetadata 
         */
        private _initializeStateWithDefaultValues(stateMetadata: Map<string, CustomElementStateMetadata>) {

            for (const [name, state] of stateMetadata) {

                const {
                    value
                } = state;

                if (this._state[name] === undefined &&
                    value !== undefined) {

                    this.setState(name, value);
                }
            }
        }

        /* protected */ _setState(key: string, value: unknown): boolean {

            // Verify that the property of the state is one of the configured in the custom element
            if ((this.constructor as CustomHTMLElementConstructor).metadata.state.get(key) === undefined) {

                throw Error(`There is no configured property for state: '${key}' in type: '${this.constructor.name}'`)
            }

            const oldValue = this._state[key];

            if (oldValue === value) {

                return false;
            }

            this._state[key] = value;

            return true;
        }
    }
}