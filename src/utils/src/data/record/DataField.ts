import { DataFieldDescriptor, IDataField } from "./interfaces";
import Observer from "../../observer/Observer";
import Subscriber from "../../observer/Subscriber";
import { ConversionTypes } from "../../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";

function toTypeOf(type: ConversionTypes) {

    switch (type) {
        case ConversionTypes.String: return 'string';
        case ConversionTypes.Boolean: return 'boolean';
        case ConversionTypes.Number: return 'number';
        case ConversionTypes.BigInt: return 'bigint';
        default: return 'object';
    }
}

/**
 * The field that is stored in a record of a store
 */
export default class DataField implements IDataField {

    /**
     * The descriptor of the field
     */
    private _fieldDescriptor: DataFieldDescriptor;

    /** The current value */
    private _value?: string;

    /** 
     * The initial value of the field 
     * The initial value is the one set on the initialize function and
     * corresponds to the value of the field of an empty record or a loaded one.
     * A field is considered "modified" if its current value is different from the "initial" one
     */
    private _initialValue?: string;

    /** The observer to notify when the value of the field changed */
    private _observer: Observer = new Observer('onValueSet');

    constructor(fieldDescriptor: DataFieldDescriptor, subscriber: Subscriber) {

        this._fieldDescriptor = fieldDescriptor;

        if (fieldDescriptor.value !== undefined) {

            this.initialize(fieldDescriptor.value);
        }

        this._observer.subscribe(subscriber);
    }

    get name() {

        return this._fieldDescriptor.name;
    }

    get isId() {

        return this._fieldDescriptor.isId;
    }

    initialize(value: any) {

        // Convert the value if its type is different from the expected type of the field descriptor
        if (value !== undefined &&
            value != null &&
            typeof value !== toTypeOf(this._fieldDescriptor.type)) {

            value = this._fieldDescriptor.converter!.fromString(value, this._fieldDescriptor.type);
        }

        this._value = value;

        this._initialValue = value;
    }

    set value(value: string) {

        const oldValue = this._value;

        // Convert the value if its type is different from the expected type of the field descriptor
        if (value !== undefined &&
            value != null &&
            typeof value !== toTypeOf(this._fieldDescriptor.type)) {

            value = this._fieldDescriptor.converter!.fromString(value, this._fieldDescriptor.type);
        }

        this._value = value;

        this._observer.notify(
            this._fieldDescriptor,
            this._value,
            oldValue,
            this._initialValue
        );
    }

    get value(): any {

        return this._value;
    }

    reset(): void {

        this.value = this._initialValue as string;
    }

    hasSameInitialValue(value: any): boolean {

        return this._initialValue === value
    }
}