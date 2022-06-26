import DataField from "./DataField";
import { SingleRecordDataProvider } from "../DataProvider";
import { DynamicObject } from "../../types";
import isUndefinedOrNull from "../../isUndefinedOrNull";

/**
 * The collection of data fields
 */
export default class DataRecord implements SingleRecordDataProvider {

    private _fields: Map<string, DataField> = new Map<string, DataField>();

    private _modifiedFields: Map<string, DataField> = new Map<string, DataField>();

    /**
     * The cached data of the record
     */
    private _data?: DynamicObject = undefined;

    setField(name: string, dataField: DataField) : void {

        this._fields.set(name, dataField);
    }

    setData(data: DynamicObject, acceptChanges: boolean = false): void {

        this._modifiedFields.clear();

        for (const key in data) {

            if (data.hasOwnProperty(key)) {

                const dataField = this._fields.get(key);

                if (dataField !== undefined) {

                    dataField.value = data[key];

                    if (acceptChanges === true) {

                        dataField.acceptChanges();
                    }
                    else if (dataField.valueHasChanged()) {

                        this._modifiedFields.set(key, dataField);
                    }
                }
                else { // The field does not need to exist for the given data member but let the programmer know it is missing

                    console.warn(`Field of name: '${key}' was not found for data memeber with same name`);
                }
            }
        }

    }

    getData(): DynamicObject {

        const {
            _data,
            _fields
        } = this;

        if (_data !== undefined) {

            return _data;
        }

        const data: DynamicObject = {};

        for (const key in _fields) {

            const value = _fields.get(key)?.value;

            if (!isUndefinedOrNull(value)) {

                data[key] = value;
            }
        }

        this._data = data;

        return data;
    }

    get isModified() {

        return this._modifiedFields.size > 0;
    }
}