import { SingleRecordDataProvider } from "../../../../utils/data/DataProvider";
import { ComparisonOperatorsEnum } from "../../../../utils/operators/ComparisonOperatorsEnum";
import CompareValidator from "../../../../utils/validation/validators/record/CompareValidator";
import { RecordValidationContext } from "../../../../utils/validation/validators/record/RecordValidator";

describe("CompareValidator tests", () => {

    it("CompareValidator should emit an error when the values are not equal", () => {

        const dataProvider: SingleRecordDataProvider = {
            
            getData() {

                return {
                    password: 'pass1',
                    verifyPassword: 'pass2'
                };
            }
        }
        
        const validator = new CompareValidator({
            
            propertyToValidate: 'password',
            propertyToCompare: 'verifyPassword',
            operator: ComparisonOperatorsEnum.Equal,
            message: 'Password must match'
        });

        const validationContext : RecordValidationContext = {
            errors: [],
            warnings: [],
            dataProvider
        };

        const valid = validator.validate(validationContext);

        expect(valid).toEqual(false);

        expect(validationContext.errors[0]).toEqual('Password must match');
    });

    it("CompareValidator should no emit errors when the values are equal", () => {

        const dataProvider: SingleRecordDataProvider = {
            
            getData() {

                return {
                    password: 'pass1',
                    verifyPassword: 'pass1'
                };
            }
        }
        
        const validator = new CompareValidator({
            
            propertyToValidate: 'password',
            propertyToCompare: 'verifyPassword',
            operator: ComparisonOperatorsEnum.Equal,
            message: 'Password must match'
        });

        const validationContext : RecordValidationContext = {
            errors: [],
            warnings: [],
            dataProvider
        };

        const valid = validator.validate(validationContext);

        expect(valid).toEqual(true);

        expect(validationContext.errors.length).toEqual(0);
    });
});