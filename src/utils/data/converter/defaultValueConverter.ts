import { ConversionTypes } from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import isUndefinedOrNull from "../../isUndefinedOrNull";
import ValueConverter from "./ValueConverter";

const defaultValueConverter: ValueConverter = {

    fromString: (value: string, type: ConversionTypes) : unknown => {

        switch (type) {
            case ConversionTypes.String:
                return value;
            case ConversionTypes.Boolean:
                return value !== 'false';
            case ConversionTypes.Number:
                return Number(value);
            case ConversionTypes.Date:
                return new Date(value);
            case ConversionTypes.Object:
            case ConversionTypes.Array:
                return JSON.parse(value);
            default: throw new Error(`Conversion fromString not implemented for type: ${type}`);
        }

        return value;
    },

    toString: (value: unknown, type: ConversionTypes) : string | null => {

        switch (type) {
            case ConversionTypes.String:
                return value as string;
            case ConversionTypes.Boolean:
            case ConversionTypes.Number:
                return (value as number).toString();
            case ConversionTypes.Date:
                return (value as Date).toISOString();
            case ConversionTypes.Object:
            case ConversionTypes.Array:
                return isUndefinedOrNull(value) ? null : JSON.stringify(value);
            default: throw new Error(`Conversion toString not implemented for type: ${type}`);
        }
    }
};

export default defaultValueConverter;