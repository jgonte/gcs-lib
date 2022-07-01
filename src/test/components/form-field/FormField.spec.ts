import TextField from "../../../components/fields/text/TextField";
import FormField from "../../../components/form/form-field/FormField";
import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import clearCustomElements from "../../custom-element/helpers/clearCustomElements";
import getContentWithoutStyle from "../helpers/getContentWithoutStyle";

beforeEach(() => {

    clearCustomElements();
});

describe("form tests", () => {

    it('should render a form field', async () => {

        // Re-register the form since all the custom elements are cleared before any test
        defineCustomElement('wcl-text-field', TextField);

        defineCustomElement('wcl-form-field', FormField);

        // Attach it to the DOM
        document.body.innerHTML = `<wcl-form-field>
            <span slot="label">Name</span>
            <wcl-text-field slot="field" name="name"></wcl-text-field>
        </wcl-form-field>`;

        // Test the element
        const component = document.querySelector('wcl-form-field') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<wcl-row id=\"form-field-row\">    \n            <wcl-form-label required=\"false\" modified=\"false\" label-align=\"left\" style=\"width: 50%; min-width: 50%;\">\n                    <span slot=\"label\">\n                        <slot name=\"label\"></slot>\n                    </span>\n                    <slot name=\"tools\"></slot>   \n            </wcl-form-label>            \n            <slot name=\"field\"></slot>      \n        </wcl-row>\n        <wcl-validation-summary warnings=\"[]\" errors=\"[]\">\n        </wcl-validation-summary>");
    });
});