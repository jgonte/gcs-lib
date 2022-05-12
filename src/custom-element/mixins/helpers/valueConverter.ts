import getGlobalFunction from "../../../utils/getGlobalFunction";
import { ConversionTypes } from "../metadata/types/CustomElementPropertyMetadata";

const valueConverter = {

    toProperty: (value: string, type: ConversionTypes | ConversionTypes[]) => {

        if (value === null) {

            return null;
        }

        if (!Array.isArray(type)) { // Convert type to array so we can handle multiple types as well

            type = [type];
        }

        // First try a function since that can create any of the objects below
        if (value[value.length - 2] === '(' && value[value.length - 1] === ')' // The function by convention must end in ()
            && type.includes(ConversionTypes.Function)) {

            const fcn = getGlobalFunction(value);

            if (fcn !== undefined) {

                return fcn;
            }
        }

        if (type.includes(ConversionTypes.Object) ||
            type.includes(ConversionTypes.Array)
        ) {

            let o;

            try {

                o = JSON.parse(value);
            }
            catch (error) {

                if (!type.includes(ConversionTypes.String)) {

                    throw error; // Malformed JSON
                }

                // Try the other types below
            }

            if (o !== undefined) {

                if (!Array.isArray(o) &&
                    !type.includes(ConversionTypes.Object)) {

                    throw Error(`value: ${value} is not an array but there is no object type expected`);
                }

                if (Array.isArray(o) &&
                    !type.includes(ConversionTypes.Array)) {

                    throw Error(`value: ${value} is an array but there is no array type expected`);
                }

                return o;
            }
        }

        if (type.includes(ConversionTypes.Boolean)) {

            return true;
        }

        if (type.includes(ConversionTypes.Number)) {

            return Number(value);
        }

        return value;
    },

    toAttribute: (value: unknown): unknown => {

        if (value === null) {

            return null;
        }
        
        const type = typeof value;

        if (type === 'boolean') {

            return value === true ?
                '' :
                null; // This will clear the attribute
        }

        if (type === 'object' || Array.isArray(value)) {

            return JSON.stringify(value);
        }

        return value;
    }

};

export default valueConverter;