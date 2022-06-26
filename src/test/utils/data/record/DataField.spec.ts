import { DataTypes } from "../../../../utils/data/DataTypes";
import DataField from "../../../../utils/data/record/DataField";

describe("DataField tests", () => {

    it("should track the changed value", () => {

        const dataField = new DataField();

        dataField.type = DataTypes.Number;

        // Set the initial value
        dataField.value = "21";

        expect(dataField.value).toEqual(21);

        expect(dataField.isDifferentValue(21)).toBeFalsy();

        // Test for different values
        expect(dataField.isDifferentValue(22)).toBeTruthy();

        expect(dataField.isDifferentValue('22')).toBeTruthy();

        // Set a different value
        dataField.value = "22";

        expect(dataField.value).toEqual(22);

        expect(dataField.valueHasChanged()).toBeTruthy();

        // Set the initial value
        dataField.value = "21"; 

        expect(dataField.value).toEqual(21);

        expect(dataField.valueHasChanged()).toBeDefined();

        // Set a different value and accept changes
        dataField.value = "23";

        expect(dataField.value).toEqual(23);

        dataField.acceptChanges();

        expect(dataField.valueHasChanged()).toBeFalsy();

    });
});