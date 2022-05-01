import { NodePatchingData } from "../nodes/NodePatchingData";

export default function areEquivalentValues(v1: unknown = null, v2: unknown = null): boolean {

    if (v1 === v2) {

        return true;
    }

    if (v1 === null &&
        v2 !== null) {

        return false;
    }

    if (v1 !== null &&
        v2 === null) {

        return false;
    }

    const {
        patcher: patcher1,
        values: values1
    } = v1 as NodePatchingData;

    const {
        patcher: patcher2,
        values: values2
    } = v2 as NodePatchingData;

    if (patcher1 !== undefined &&
        patcher2 !== undefined) {

        if (patcher1 === patcher2) {

            return areEquivalentValues(values1, values2);
        }
        else {

            return false;
        }
    }

    // If both values are array
    if (Array.isArray(v1) &&
        Array.isArray(v2)) {

        if (v1.length !== v2.length) {

            return false;
        }
        else {

            for (let i = 0; i < v1.length; ++i) {

                if (!areEquivalentValues(v1[i], v2[i])) {

                    return false;
                }
            }

            return true;
        }
    }

    // If both values are objects
    if (typeof v1 === 'object' &&
        typeof v2 === 'object') {

        const k1 = Object.keys(v1 as object);

        const k2 = Object.keys(v2 as object);

        if (k1.length !== k2.length) {

            return false;
        }
        else {

            for (let i = 0; i < k1.length; ++i) {

                const k = k1[i];

                if (!areEquivalentValues((v1 as Record<string, object>)[k], (v2 as Record<string, object>)[k])) {

                    return false;
                }
            }

            return true;
        }
    }

    // Types do not match
    return false;
}