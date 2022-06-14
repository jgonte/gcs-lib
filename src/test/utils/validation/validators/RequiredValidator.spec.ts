import RequiredValidator from "../../../../utils/validation/validators/field/RequiredValidator";
import { SingleValueFieldValidationContext } from "../../../../utils/validation/validators/field/SingleValueFieldValidator";

describe("RequiredValidator tests", () => {

    it("RequiredValidator with undefined value should emit a validation error message", () => {

        const validator = new RequiredValidator();

        const validationContext : SingleValueFieldValidationContext = {
            label: 'First Name',
            errors: [],
            warnings: [],
            value: undefined
        };

        const valid = validator.validate(validationContext);

        expect(valid).toEqual(false);

        expect(validationContext.errors[0]).toEqual('First Name is required');
    });

    it("RequiredValidator with a defined value should emit no errors", () => {

        const validator = new RequiredValidator();

        const validationContext : SingleValueFieldValidationContext = {
            label: 'First Name',
            errors: [],
            warnings: [],
            value: 'Sarah'
        };

        const valid = validator.validate(validationContext);

        expect(valid).toEqual(true);

        expect(validationContext.errors.length).toEqual(0);
    });
});