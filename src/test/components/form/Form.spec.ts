import TextField from "../../../components/fields/text/TextField";
import Form from "../../../components/form/Form";
import FormField from "../../../components/form/form-field/FormField";
import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import clearCustomElements from "../../custom-element/helpers/clearCustomElements";
import getContentWithoutStyle from "../helpers/getContentWithoutStyle";

beforeEach(() => {

    clearCustomElements();
});

describe("form tests", () => {

    it('should throw an error when the submit url is not provided', () => {

        // Re-register the form and its dependencies since all the custom elements are cleared before any test
        defineCustomElement('wcl-form', Form);

        expect(() => {

            // Attach it to the DOM
            document.body.innerHTML = `<wcl-form></wcl-form>`;

        }).toThrow(new Error("The attributes: [submit-url] must have a value"));
    });

    it('should render a form', async () => {

        // Re-register the form since all the custom elements are cleared before any test
        defineCustomElement('wcl-text-field', TextField);

        defineCustomElement('wcl-form-field', FormField);

        defineCustomElement('wcl-form', Form);

        // Attach it to the DOM
        document.body.innerHTML = `
        <wcl-form submit-url="http://localhost:60314/api/contacts/">
            <wcl-form-field>
                <span slot="label">Name</span>
                <wcl-text-field slot="field" id="tf2" name="name" value="Sarah"></wcl-text-field>
            </wcl-form-field>
        </wcl-form>`;

        // Test the element
        const component = document.querySelector('wcl-form') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<form><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--><slot label-width=\"50%\" label-align=\"left\" key=\"form-fields\"></slot><!--_$bm_--><wcl-button key=\"submit-button\" kind=\"primary\" variant=\"contained\">\n           <wcl-localized-text resource-key=\"submit\">Submit</wcl-localized-text>\n           <wcl-icon name=\"box-arrow-right\"></wcl-icon>\n        </wcl-button><!--_$em_--></form>");
    });

    it('should render a form with non-default attributes set', async () => {

        // Re-register the form since all the custom elements are cleared before any test
        defineCustomElement('wcl-text-field', TextField);

        defineCustomElement('wcl-form-field', FormField);

        defineCustomElement('wcl-form', Form);

        // Attach it to the DOM
        document.body.innerHTML = `
        <wcl-form submit-url="http://localhost:60314/api/contacts/" label-align="right" label-width="70%">
            <wcl-form-field>
                <span slot="label">Name</span>
                <wcl-text-field slot="field" id="tf2" name="name" value="Sarah"></wcl-text-field>
            </wcl-form-field>
        </wcl-form>`;

        // Test the element
        const component = document.querySelector('wcl-form') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<form><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--><!--_$bm_--><!--_$em_--><slot label-width=\"70%\" label-align=\"right\" key=\"form-fields\"></slot><!--_$bm_--><wcl-button key=\"submit-button\" kind=\"primary\" variant=\"contained\">\n           <wcl-localized-text resource-key=\"submit\">Submit</wcl-localized-text>\n           <wcl-icon name=\"box-arrow-right\"></wcl-icon>\n        </wcl-button><!--_$em_--></form>");
    });

    // it('should render when the data of the attributes is provided via functions', async () => {

    //     // Set up the functions to be called
    //     (window as any).getData = function () {

    //         return [
    //             {
    //                 name: "Sarah",
    //                 age: 19,
    //                 description: 'Smart and beautiful'
    //             },
    //             {
    //                 name: "Mark",
    //                 age: 31,
    //                 description: 'Hard worker'
    //             }
    //         ];
    //     };

    //     (window as any).getFields = function () {

    //         return ["name", "age", "description"];
    //     };

    //     // Re-register the form since all the custom elements are cleared before any test
    //     defineCustomElement('wcl-data-cell', DataCell);

    //     defineCustomElement('wcl-data-row', DataRow);

    //     defineCustomElement('wcl-data-grid', DataGrid);

    //     // Attach it to the DOM
    //     document.body.innerHTML = '<wcl-data-grid id="dg2" data="getData()" fields="getFields()"></wcl-data-grid>';

    //     // Test the element
    //     const component: any = document.querySelector('wcl-data-grid');

    //     await component.updateComplete; // Wait for the component to render

    //     expect(component.shadowRoot.innerHTML).toBe(`<wcl-data-header fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\"></wcl-data-header><!----><wcl-data-row fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\" record=\"{&#x22;name&#x22;:&#x22;Sarah&#x22;,&#x22;age&#x22;:19,&#x22;description&#x22;:&#x22;Smart and beautiful&#x22;}\" key=\"tbd\"></wcl-data-row><!----><wcl-data-row fields=\"[&#x22;name&#x22;,&#x22;age&#x22;,&#x22;description&#x22;]\" record=\"{&#x22;name&#x22;:&#x22;Mark&#x22;,&#x22;age&#x22;:31,&#x22;description&#x22;:&#x22;Hard worker&#x22;}\" key=\"tbd\"></wcl-data-row><!----><style>[object Object]</style>`);
    // });
});