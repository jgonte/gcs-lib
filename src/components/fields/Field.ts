import CustomElement from "../../custom-element/CustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElement from "../../custom-element/mixins/metadata/types/CustomHTMLElement";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import { DataTypes } from "../../utils/data/DataTypes";
import DataField from "../../utils/data/record/DataField";
import RequiredValidator from "../../utils/validation/validators/field/RequiredValidator";
import SingleValueFieldValidator, { FieldValidationContext } from "../../utils/validation/validators/field/SingleValueFieldValidator";
import Validator from "../../utils/validation/validators/Validator";
import LocalizedText from "../localized-text/LocalizedText";
import Disableable from "../mixins/disableable/Disableable";
import Sizable from "../mixins/sizable/Sizable";
import Validatable from "../mixins/validatable/Validatable";
import { fieldStyles } from "./Field.styles";

export const inputEvent = "inputEvent";

export const changeEvent = "changeEvent";

export const fieldAddedEvent = "fieldAddedEvent";

export default abstract class Field extends
    Disableable(
        Sizable(
            Validatable(
                CustomElement as CustomHTMLElementConstructor
            )
        )
    ) {

    protected dataField: DataField = new DataField();

    static getFieldType(): DataTypes {

        return DataTypes.String;
    }

    // The temporary value being validated on input
    // Since it is not the final one, there is no need to refresh it
    private _tempValue: unknown = undefined;

    // Marker to mark the field as such so it can be filtered out from other components
    isField = true; // TODO: Make it static?

    static get styles(): string {

        return mergeStyles(super.styles, fieldStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The name of the field
             */
            name: {
                type: DataTypes.String,
                required: true
            },

            /**
             * The initial value of the field
             */
            value: {
                type: [
                    DataTypes.String,
                    DataTypes.Object // Ideally is a string but could be a more complex object
                ],
                reflect: true
            },

            required: {
                type: DataTypes.Boolean,
                inherit: true,
                reflect: true
            }
        };
    }

    connectedCallback() {

        super.connectedCallback?.();

        const {
            dataField
        } = this;

        // Initialize the data field
        dataField.type = (this.constructor as any).getFieldType();

        // Set the initial value if any
        dataField.value = this.value;
    }

    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string) {

        super.attributeChangedCallback?.(attributeName, oldValue, newValue);
        
        if (attributeName === 'required') {

            if (newValue !== "false") { // Add a required validator

                if (!this.hasRequiredValidator()) {

                    const {
                        validators = []
                    } = this;

                    this.validators = [...validators, new RequiredValidator()];
                }
            }
            else { // remove any existing required validator

                if (this.hasRequiredValidator()) {

                    const {
                        validators
                    } = this;

                    const requiredValidator = validators.filter((v: SingleValueFieldValidator) => v instanceof RequiredValidator)[0];

                    if (requiredValidator !== undefined) {

                        const index = validators.indexOf(requiredValidator);

                        validators.splice(index, 1);

                        this.validators = validators;
                    }
                }
            }
        }

        super.attributeChangedCallback(attributeName, oldValue, newValue);
    }

    hasRequiredValidator(): boolean {

        return this.validators.filter((v: Validator) => v instanceof RequiredValidator).length > 1;
    }

    didAdoptChildCallback(parent: CustomHTMLElement, child: HTMLElement) {

        super.didAdoptChildCallback?.(parent, child);

        if (child !== this) { // Not a field

            return;
        }

        this.dispatchCustomEvent(fieldAddedEvent, {
            field: child
        });
    }

    handleBlur(/*event: Event*/) {

        //this.validate();
    }

    /**
     * Called every time the input changes
     * Perform validation to give instantaneous feedback but do not update the current value since it might keep changing
     * @param event 
     * @returns 
     */
    handleInput(event: Event) {

        this._tempValue = this.getNewValue(event.target as HTMLInputElement);

        this.validate(); // Validate the field on input

        this.dispatchCustomEvent(inputEvent, {
            modified: this.dataField?.isDifferentValue(this._tempValue)
        });
    }

    async createValidationContext(): Promise<FieldValidationContext & { value: unknown; }> {

        const label = await this.getLabel();

        const value = this._tempValue ?? this.value;

        return {
            label,
            value,
            warnings: [],
            errors: []
        };
    }

    initializeValidator(validator: string): Validator {

        switch (validator) {

            case 'required': return new RequiredValidator();
            default: throw new Error(`initializeValidator is not implemented for validator: '${validator}'`);
        }
    }

    /**
     * The cached label
     */
    private _label?: HTMLElement;

    async getLabel(): Promise<string> {

        if (this._label === undefined) {

            const adoptingParent = await this.getAdoptingParent();

            const lt = Array.from(adoptingParent.children)
                .filter(c => (c as HTMLElement).getAttribute('slot') === 'label');

            switch (lt.length) {
                case 0:
                    {
                        // Do nothing
                    }
                    break;
                case 1:
                    {
                        this._label = lt[0] as HTMLElement;
                    }
                    break;
                default: throw new Error('Only one element can have the attribute of slot=label in the Field');
            }
        }

        const cachedLabel = this._label;

        if (cachedLabel === undefined) {

            return "This field";
        }

        return cachedLabel instanceof LocalizedText ?
            (cachedLabel as LocalizedText).value :
            cachedLabel.innerHTML;
    }

    handleChange(event: Event): void {

        // Reset the temporary value
        this._tempValue = undefined;

        // Retrieve the new value
        const target = event.target as HTMLInputElement;

        const oldValue = this.value;

        this.value = this.getNewValue(target);

        const {
            name,
            value
        } = this;

        this.dispatchCustomEvent(changeEvent, {
            name,
            oldValue,
            newValue: value
        });
    }

    getNewValue(input: HTMLInputElement): unknown {

        let value: unknown;

        switch (input.type) {
            case 'file':
                {
                    const {
                        files
                    } = input;

                    if (files === null ||
                        files.length === 0) { // No files selected

                        return value;
                    }

                    if (input.multiple === true) {

                        value = Array.from(files).map(f => {

                            return {
                                name: f.name,
                                type: f.type,
                                size: f.size,
                                content: URL.createObjectURL(f)
                            };
                        });
                    }
                    else {

                        const f = files[0];

                        value = {
                            name: f.name,
                            type: f.type,
                            size: f.size,
                            content: URL.createObjectURL(f)
                        };
                    }
                }
                break;
            default:
                {
                    value = input.value;
                }
                break;
        }

        return value;
    }
}