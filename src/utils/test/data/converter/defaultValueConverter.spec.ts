import { ConversionTypes } from '../../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata';
import defaultValueConverter from '../../../src/data/converter/defaultValueConverter';

describe("defaultValueConverter tests", () => {

    it("should convert from string to Boolean and viceversa", () => {

        expect(defaultValueConverter.fromString("true", ConversionTypes.Boolean)).toEqual(true);

        expect(defaultValueConverter.fromString("false", ConversionTypes.Boolean)).toEqual(false);

        expect(defaultValueConverter.toString(true, ConversionTypes.Boolean)).toEqual("true");

        expect(defaultValueConverter.toString(false, ConversionTypes.Boolean)).toEqual("false");
    });

    it("should convert from string to Date and viceversa", () => {

        expect(defaultValueConverter.fromString("2002-05-25T04:00:00.000Z", ConversionTypes.Date)).toEqual(new Date(2002, 4, 25));

        expect(defaultValueConverter.toString(new Date(2002, 4, 25), ConversionTypes.Date)).toEqual("2002-05-25T04:00:00.000Z");
    });

    it("should convert from string to Number and viceversa", () => {

        expect(defaultValueConverter.fromString("1234", ConversionTypes.Number)).toEqual(1234);

        expect(defaultValueConverter.toString(1234, ConversionTypes.Number)).toEqual("1234");
    });
});