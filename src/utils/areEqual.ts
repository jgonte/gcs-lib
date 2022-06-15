import { GenericRecord } from "./types";

/**
 * Compares two objects for equality recursively
 * @param o1 
 * @param o2 
 * @returns 
 */
export default function areEqual(o1: unknown, o2: unknown): boolean {

    const type1 = typeof o1;

    const type2 = typeof o2;

    if (type1 !== type2) {

        return false;
    }

    if (type1 == 'object') {

        if (Object.getOwnPropertyNames(o1).length !== Object.getOwnPropertyNames(o2).length) {

            return false;
        }
    
        for (const prop in o1 as object) {
    
            if ((o1 as object).hasOwnProperty(prop)) {
    
                if ((o2 as object).hasOwnProperty(prop)) {
    
                    if (typeof (o1 as GenericRecord)[prop] === 'object') {
    
                        if (!areEqual((o1 as GenericRecord)[prop], (o2 as GenericRecord)[prop])) {
    
                            return false;
                        }
                    }
                    else {
    
                        if ((o1 as GenericRecord)[prop] !== (o2 as GenericRecord)[prop]) {
    
                            return false;
                        }
                    }
                }
                else {
    
                    return false;
                }
            }
        }
    
        return true;

    }
    else {

        return o1 === o2;
    }
    
}