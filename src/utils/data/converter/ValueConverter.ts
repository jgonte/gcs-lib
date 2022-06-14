import { ConversionTypes } from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";

export default interface ValueConverter {

    fromString: (value: string, type: ConversionTypes) => unknown;

    toString: (value: unknown, type: ConversionTypes) => string | null;
}