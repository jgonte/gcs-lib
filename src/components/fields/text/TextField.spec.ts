import defineCustomElement from "../../../custom-element/defineCustomElement";
import clearCustomElements from "../../../custom-element/test/helpers/clearCustomElements";
import TextField from "./TextField";

beforeEach(() => {

    clearCustomElements();
});

describe("Text field tests", () => {

    it('should throw an error when the required attributes are not provided', () => {

        // Re-register the data cell since all the custom elements are cleared before any test
        defineCustomElement('gcl-text-field', TextField);

        expect(() => {

            // Attach it to the DOM
            document.body.innerHTML = `<gcl-text-field></gcl-text-field>`;

        }).toThrow(new Error("The attributes: [name] must have a value"));
    });

    it('should not render the value when it is not provided', async () => {

        // Re-register the data cell since all the custom elements are cleared before any test
        defineCustomElement('gcl-text-field', TextField);

        // Attach it to the DOM
        document.body.innerHTML = '<gcl-text-field id="tf1" name="name"></gcl-text-field>';

        // Test the element
        const component: any = document.querySelector('gcl-text-field');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(
`<style>[object Object]

[object Object]</style><input type=\"text\" name=\"name\"/>`);

        component.value = "Sarah";

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(
`<style>[object Object]

[object Object]</style><input type=\"text\" name=\"name\" value=\"Sarah\"/>`);

        component.value = "Mark";

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(
`<style>[object Object]

[object Object]</style><input type=\"text\" name=\"name\" value=\"Mark\"/>`);
    });

    it('should render the value when it is provided', async () => {

        // Re-register the data cell since all the custom elements are cleared before any test
        defineCustomElement('gcl-text-field', TextField);

        // Attach it to the DOM
        document.body.innerHTML = '<gcl-text-field id="tf1" name="name" value="Sarah"></gcl-text-field>';

        // Test the element
        const component: any = document.querySelector('gcl-text-field');

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(
`<style>[object Object]

[object Object]</style><input type=\"text\" name=\"name\" value=\"Sarah\"/>`);

        component.value = "Mark";

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot.innerHTML).toBe(
`<style>[object Object]

[object Object]</style><input type=\"text\" name=\"name\" value=\"Mark\"/>`);
    });
});