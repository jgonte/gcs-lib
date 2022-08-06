import ChangeTracker from "../mixins/change-tracker/ChangeTracker";
import Disableable from "../mixins/disableable/Disableable";
import Sizable from "../mixins/sizable/Sizable";
import Field from "./Field";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import { displayableFieldStyles } from "./DisplayableField.styles";

export const inputEvent = "inputEvent";

export default abstract class DisplayableField extends
    ChangeTracker(
        Disableable(
            Sizable(
                Field as unknown as CustomHTMLElementConstructor
            )
        )
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, displayableFieldStyles);
    }

    /**
     * Called every time the input changes
     * @param event The event of the element with the change
     */
    handleInput(event: Event): void {

        super.handleInput(event);

        const {
            _tempValue: value
        } = this;

        this.updateCurrentValue(value);

        this.dispatchCustomEvent(inputEvent, {
            modified: this.valueHasChanged(value) // Notify the parent whether the value has changed or not
        });
    }
}