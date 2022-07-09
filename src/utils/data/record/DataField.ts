import ValueConverter from "../converter/ValueConverter";
import isUndefinedOrNull from "../../isUndefinedOrNull";
import { DataTypes } from "../DataTypes";
import defaultValueConverter from "../converter/defaultValueConverter";

/**
 * The field that is stored in a record of a store
 */
export default class DataField {

    /**
     * The type of the field
     */
    type?: DataTypes;

    /**
     * The converter to convert the value if the value comes as a string
     */
    private converter: ValueConverter = defaultValueConverter;

    /** 
     * The initial value of the field 
     * A field is considered "modified" if its current value is different from the initial one
     */
    private _initialValue?: unknown;

    /**
     * The current value of the field
     */
    private _value: unknown;

    /**
     * Flag to determine whether the value has been set already
     */
    private _valueSet: boolean = false;

    /**
     * Sets the value of the data field
     */
    set value(value: string | unknown) {

        // Convert the value if its type is different from the expected type of the field descriptor
        if (!isUndefinedOrNull(value) &&
            typeof value !== this.type) {

            value = this.converter.fromString(value as string, this.type as DataTypes);
        }

        this._value = value;

        if (!this._valueSet) { // Synchronize the values

            this._valueSet = true;

            this._initialValue = value;
        }
    }

    /**
     * Gets the value from the data field
     */
    get value(): unknown {

        return this._value;
    }

    /**
     * Reconciles the current value with the initial one
     */
    acceptChanges(): void {

        this._initialValue = this._value;
    }

    /**
     * Tests whether the incoming value is different from the initial one
     * @param value 
     * @returns 
     */
    isDifferentValue(value: string | unknown): boolean {

        if (!isUndefinedOrNull(value) &&
            typeof value !== this.type) {

            value = this.converter.fromString(value as string, this.type as DataTypes);
        }

        return this._initialValue !== value;
    }

    /**
     * Tests whether the current value is different from the initial one
     * @returns 
     */
    valueHasChanged(): boolean {

        return this._initialValue !== this._value;
    }
}