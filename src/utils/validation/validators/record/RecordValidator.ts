import { DataProvider, ReturnedData } from "../../../src/data/DataProvider";
import Validator, { ValidationContext } from "../Validator";

export interface RecordValidationContext extends ValidationContext {

    dataProvider: DataProvider;
}

export default abstract class RecordValidator extends Validator {

    abstract validate(context: RecordValidationContext): boolean;

    getData(context: RecordValidationContext): ReturnedData {

        return context.dataProvider.getData();
    }
}