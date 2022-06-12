import template from "../../src/template";

export interface ValidationContext {

    /** The error messages */
    errors: string[];

    /** The warning messages */
    warnings: string[];
}

export interface ValidatorOptions {

    message?: string;
}

export default abstract class Validator {

    /** The message to add to the validation context */
    message?: string;

    constructor(options: ValidatorOptions) {

        this.message = options?.message;
    }

    abstract validate(context: ValidationContext): boolean;

    /**
     * Adds an error message to the arrays of errors of the context
     * @param context The context containing the array of errors
     * @param data The data to replace the template placeholders with
     */
    emitErrors(context: ValidationContext, data: (object & Record<string, string | number>)) {

        const result = template(this.message as string, data);

        context.errors.push(result.text as string);
    }

    /**
     * Adds an warning message to the arrays of warnings of the context
     * @param context The context containing the array of warnings
     * @param data The data to replace the template placeholders with
     */
    emitWarnings(context: ValidationContext, data: (object & Record<string, string | number>)) {

        const result = template(this.message as string, data);

        context.warnings.push(result.text as string);
    }
}