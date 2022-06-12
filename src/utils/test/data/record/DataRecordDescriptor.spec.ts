import { ConversionTypes } from "../../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import DataRecordDescriptor from "../../../src/data/record/DataRecordDescriptor";

describe("DataRecordDescriptor tests", () => {

    it("should create an identifier object from data where the id field is a single one", () => {

        const recordDescriptor = new DataRecordDescriptor();

        recordDescriptor.fromModel({
            id: {
                isId: true,
                type: ConversionTypes.Number
            },
            iq: {
                type: ConversionTypes.Number
            },
            name: {
                type: ConversionTypes.String
            },
            dob: {
                type: ConversionTypes.Date
            },
            isActive: {
                type: ConversionTypes.Boolean
            }
        });

        const idInfo = recordDescriptor.getId({
            id: 3,
            iq: 250,
            name: 'Issac',
            dob: new Date(1926, 2, 28),
            isActive: true
        });

        expect(idInfo.value).toEqual({ id: 3 });

        expect(idInfo.noDescriptorsId).toEqual(false);

        expect(idInfo.hasUndefinedIdentifiers).toEqual(false);
    });

    it("should create an identifier object from data where the id field is a composite one", () => {

        const recordDescriptor = new DataRecordDescriptor();

        recordDescriptor.fromModel({
            id: {
                isId: true,
                type: ConversionTypes.Number
            },
            ssn: {
                isId: true,
                type: ConversionTypes.String
            },
            iq: {
                type: ConversionTypes.Number
            },
            name: {
                type: ConversionTypes.String
            },
            dob: {
                type: ConversionTypes.Date
            },
            isActive: {
                type: ConversionTypes.Boolean
            }
        });

        const idInfo = recordDescriptor.getId({
            id: 3,
            ssn: '001-222-0101',
            iq: 250,
            name: 'Issac',
            dob: new Date(1926, 2, 28),
            isActive: true
        });

        expect(idInfo.value).toEqual({
            id: 3,
            ssn: '001-222-0101'
        });

        expect(idInfo.noDescriptorsId).toEqual(false);

        expect(idInfo.hasUndefinedIdentifiers).toEqual(false);
    });


    it("should create an identifier object from all the fields of the data when no id field is specified", () => {

        const recordDescriptor = new DataRecordDescriptor();

        recordDescriptor.fromModel({
            name: {
                type: ConversionTypes.String
            },
            iq: {
                type: ConversionTypes.Number
            },
            dob: {
                type: ConversionTypes.Date
            },
            isActive: {
                type: ConversionTypes.Boolean
            }
        });

        const idInfo = recordDescriptor.getId({
            iq: 250,
            name: 'Issac',
            dob: new Date(1926, 2, 28),
            isActive: true
        });

        expect(idInfo.value).toEqual({
            iq: 250,
            name: 'Issac',
            dob: new Date(1926, 2, 28),
            isActive: true
        });

        expect(idInfo.noDescriptorsId).toEqual(true);

        expect(idInfo.hasUndefinedIdentifiers).toEqual(false);
    });

    it("should create an identifier object from data where the id field is a single one but undefined", () => {

        const recordDescriptor = new DataRecordDescriptor();

        recordDescriptor.fromModel({
            id: {
                isId: true,
                type: ConversionTypes.Number
            },
            iq: {
                type: ConversionTypes.Number
            },
            name: {
                type: ConversionTypes.String
            },
            dob: {
                type: ConversionTypes.Date
            },
            isActive: {
                type: ConversionTypes.Boolean
            }
        });

        const idInfo = recordDescriptor.getId({
            iq: 250,
            name: 'Issac',
            dob: new Date(1926, 2, 28),
            isActive: true
        });

        expect(idInfo.value).toEqual({
            id: undefined,
            iq: 250,
            name: 'Issac',
            dob: new Date(1926, 2, 28),
            isActive: true
        });

        expect(idInfo.noDescriptorsId).toEqual(false);

        expect(idInfo.hasUndefinedIdentifiers).toEqual(true);
    });

    it("should create an identifier object from data where the id field is a composite one but one or all of them are undefined", () => {

        const recordDescriptor = new DataRecordDescriptor();

        recordDescriptor.fromModel({
            id: {
                isId: true,
                type: ConversionTypes.Number
            },
            ssn: {
                isId: true,
                type: ConversionTypes.String
            },
            iq: {
                type: ConversionTypes.Number
            },
            name: {
                type: ConversionTypes.String
            },
            dob: {
                type: ConversionTypes.Date
            },
            isActive: {
                type: ConversionTypes.Boolean
            }
        });

        const idInfo = recordDescriptor.getId({
            id: 3,
            //ssn: '001-222-0101', undefined
            iq: 250,
            name: 'Issac',
            dob: new Date(1926, 2, 28),
            isActive: true
        });

        expect(idInfo.value).toEqual({
            id: 3,
            ssn: undefined,
            iq: 250,
            name: 'Issac',
            dob: new Date(1926, 2, 28),
            isActive: true
        });

        expect(idInfo.noDescriptorsId).toEqual(false);

        expect(idInfo.hasUndefinedIdentifiers).toEqual(true);
    });

});
