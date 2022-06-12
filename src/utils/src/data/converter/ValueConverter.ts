import { ConversionTypes } from "../../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";

export default interface ValueConverter {

    fromString: (value: string, type: ConversionTypes) => any;

    toString: (value: any, type: ConversionTypes) => string;
}