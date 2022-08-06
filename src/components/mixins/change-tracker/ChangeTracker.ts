import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor"

/**
 * Tracks changes to a value of an element
 * @param Base 
 * @returns 
 */
export default function ChangeTracker<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class ChangeTrackerMixin extends Base {

        /** 
         * The initial value of the tracked component 
         * A component is considered "modified" if its current value is different from the initial one
         */
        private _initialValue?: unknown;

        /**
         * Flag to determine whether the value has been set already
         */
        private _isValueSet: boolean = false;

        /**
         * If the value was set for the first time, then initialize the initial value for comparison
         */
        updateCurrentValue(value: unknown): void {

            if (this._isValueSet === false) { // Synchronize the values

                this._isValueSet = true;

                this._initialValue = value;
            }
        }

        /**
         * Tests whether the current value is different from the initial one
         * @returns 
         */
        valueHasChanged(value: unknown): boolean {

            return this._initialValue !== value;
        }

        /**
         * Reconciles the current value with the initial one
         */
        acceptChanges(value: unknown): void {

            this._initialValue = value;
        }
    }
}