import { DataTypes } from "../../../../utils/data/DataTypes";
import DataField from "../../../../utils/data/record/DataField";
import DataRecord from "../../../../utils/data/record/DataRecord";

describe("DataRecord tests", () => {

    it("should track the changed values", () => {

        const dataRecord = new DataRecord();

        // Set a string field
        let dataField = new DataField();

        dataField.type = DataTypes.String;

        dataRecord.setField('name', dataField);

        // Set an number field
        dataField = new DataField();

        dataField.type = DataTypes.Number;

        dataRecord.setField('age', dataField);

        // Set a date field
        dataField = new DataField();

        dataField.type = DataTypes.Date;

        dataRecord.setField('dob', dataField);

        // Set a boolean field
        dataField = new DataField();

        dataField.type = DataTypes.Boolean;

        dataRecord.setField('beautiful', dataField);

        // Set some initial data
        dataRecord.setData({
            name: 'Sarah',
            age: 20,
            dob: new Date(2002, 4, 25),
            beautiful: true
        });

        expect(dataRecord.isModified).toBeFalsy();

        expect(dataRecord.getData()).toEqual({
            name: 'Sarah',
            age: 20,
            dob: new Date(2002, 4, 25),
            beautiful: true
        });

        // Should use the cached data
        expect(dataRecord.getData()).toEqual({
            name: 'Sarah',
            age: 20,
            dob: new Date(2002, 4, 25),
            beautiful: true
        });

        // Change the data
        dataRecord.setData({
            name: 'Mark',
            age: 30,
            dob: new Date(1990, 4, 25),
            beautiful: false // But handsome :-)
        });

        expect(dataRecord.isModified).toBeTruthy();

        expect(dataRecord.getData()).toEqual({
            name: 'Mark',
            age: 30,
            dob: new Date(1990, 4, 25),
            beautiful: false // But handsome :-)
        });

        // Change the data again but accepting changes
        dataRecord.setData({
            name: 'Flora',
            age: 90,
            dob: new Date(1930, 4, 25),
            beautiful: true,
            inexistent: 'I do not exist in a field'
        }, true);

        expect(dataRecord.isModified).toBeFalsy();

        expect(dataRecord.getData()).toEqual({
            name: 'Flora',
            age: 90,
            dob: new Date(1930, 4, 25),
            beautiful: true
        });
    });
});