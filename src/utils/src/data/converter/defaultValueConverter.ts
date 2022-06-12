import { ConversionTypes } from "../../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import ValueConverter from "./ValueConverter";

const defaultValueConverter: ValueConverter = {

    fromString: (value: string, type: ConversionTypes) => {

        switch (type) {
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

    toString: (value: any, type: ConversionTypes) => {

        switch (type) {
            case ConversionTypes.Boolean:
            case ConversionTypes.Number:
                return value.toString();
            case ConversionTypes.Date:
                return value.toISOString();
            case ConversionTypes.Object:
            case ConversionTypes.Array:
                return value == null ? value : JSON.stringify(value);
            default: throw new Error(`Conversion toString not implemented for type: ${type}`);
        }

        return value;
    }
};

export default defaultValueConverter;