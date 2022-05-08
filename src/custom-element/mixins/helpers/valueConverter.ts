import getGlobalFunction from "../../../utils/getGlobalFunction";
import { ConversionTypes } from "../metadata/types/CustomElementPropertyMetadata";

const valueConverter = {

    toProperty: (value: string, type: ConversionTypes | ConversionTypes[]) => {

        if (!Array.isArray(type)) { // Convert type to array so we can handle multiple types as well

            type = [type];
        }

        if (value === null &&
            type.includes(ConversionTypes.String)) { // When an attribute gets removed attributeChangedCallback gives the value of null

            return '';
        }

        // First try a function since that can create any of the objects below
        if (value !== null &&
            value[value.length - 2] === '(' && value[value.length - 1] === ')' // The function by convention must end in ()
            && type.includes(ConversionTypes.Function)) {

            const fcn = getGlobalFunction(value);

            if (fcn !== undefined) {

                return fcn;
            }
        }

        // if (type.includes(ElementNode)) {

        //     return createVirtualNode(value);
        // }

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

            return value !== null && value !== 'false';
        }

        if (type.includes(ConversionTypes.Number)) {

            return value === null ? null : Number(value);
        }

        return value;
    },

    toAttribute: (value: unknown): unknown => {

        const type = typeof value;

        if (type === 'boolean') {

            return value ? 'true' : 'false';
        }

        if (type === 'object' || Array.isArray(value)) {

            return value == null ? value : JSON.stringify(value);
        }

        return value;
    }

};

export default valueConverter;