import DataList from "../../../components/data-list/DataList";
import CustomElement from "../../../custom-element/CustomElement";
import defineCustomElement from "../../../custom-element/defineCustomElement";
import { GenericRecord } from "../../../utils/types";
import clearCustomElements from "../../custom-element/helpers/clearCustomElements";

beforeEach(() => {

    clearCustomElements();
});

describe("Data list tests", () => {

    it('should throw an error when the record and field attributes are not provided', () => {

        // Re-register the data list and its dependencies since all the custom elements are cleared before any test
        defineCustomElement('wcl-data-list', DataList);

        expect(() => {

            // Attach it to the DOM
            document.body.innerHTML = `<wcl-data-list></wcl-data-list>`;

        }).toThrow(new Error("The attributes: [id-field] must have a value"));
    });

    it('should render the data', async () => {

        // Re-register the data list since all the custom elements are cleared before any test
        defineCustomElement('wcl-data-list', DataList);

        // Set up the functions to be called
        (window as unknown as GenericRecord).getData = function () {

            return [
                {
                    code: 1,
                    description: "Item 1"
                }
            ];
        };

        const idField = "code";

        const displayField = "description"

        // Attach it to the DOM
        document.body.innerHTML = `<wcl-data-list data="getData()" id-field=${idField} display-field=${displayField} selectable="false"></wcl-data-list>`;

        // Test the element
        const component = document.querySelector('wcl-data-list') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("<ul><!--_$bm_--><li key=\"1\" style=\"\n    list-style-type: none;\n\">\n                <wcl-selectable selectable=\"false\" select-value=\"{&quot;code&quot;:1,&quot;description&quot;:&quot;Item 1&quot;}\"><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></wcl-selectable>\n            </li><!--_$em_--></ul>");

        // Add another item
        component.data = [
            {
                code: 1,
                description: "Item 1"
            },
            {
                code: 2,
                description: "Item 2"
            }
        ];

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("<ul><!--_$bm_--><li key=\"1\" style=\"\n    list-style-type: none;\n\">\n                <wcl-selectable selectable=\"false\" select-value=\"{&quot;code&quot;:1,&quot;description&quot;:&quot;Item 1&quot;}\"><!--_$bm_--><!--_$bm_-->Item 1<!--_$em_--><!--_$em_--></wcl-selectable>\n            </li><li key=\"2\" style=\"\n    list-style-type: none;\n\">\n                <wcl-selectable selectable=\"false\" select-value=\"{&quot;code&quot;:2,&quot;description&quot;:&quot;Item 2&quot;}\"><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></wcl-selectable>\n            </li><!--_$em_--></ul>");

        // Remove the first item
        component.data = [
            {
                code: 2,
                description: "Item 2"
            }
        ];

        await component.updateComplete; // Wait for the component to render

        expect(component.shadowRoot?.innerHTML).toBe("<ul><!--_$bm_--><li key=\"2\" style=\"\n    list-style-type: none;\n\">\n                <wcl-selectable selectable=\"false\" select-value=\"{&quot;code&quot;:2,&quot;description&quot;:&quot;Item 2&quot;}\"><!--_$bm_--><!--_$bm_-->Item 2<!--_$em_--><!--_$em_--></wcl-selectable>\n            </li><!--_$em_--></ul>");
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

    //     // Re-register the data list since all the custom elements are cleared before any test
    //     defineCustomElement('wcl-data-list', DataList);

    //     // Attach it to the DOM
    //     document.body.innerHTML = '<wcl-data-list id="dg2" id-field="name" data="getData()" fields="getFields()"></wcl-data-list>';

    //     // Test the element
    //     const component: any = document.querySelector('wcl-data-list');

    //     await component.updateComplete; // Wait for the component to render

    //     expect(component.shadowRoot.innerHTML).toBe("<style>[object Object]</style><!--_$bm_--><wcl-data-header fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\"></wcl-data-header><!--_$em_--><!--_$bm_--><wcl-data-row fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\" record=\"{&quot;name&quot;:&quot;Sarah&quot;,&quot;age&quot;:19,&quot;description&quot;:&quot;Smart and beautiful&quot;}\" key=\"Sarah\"></wcl-data-row><wcl-data-row fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\" record=\"{&quot;name&quot;:&quot;Mark&quot;,&quot;age&quot;:31,&quot;description&quot;:&quot;Hard worker&quot;}\" key=\"Mark\"></wcl-data-row><!--_$em_-->");
    // });

    // it('should swap the records', async () => {

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

    //     // Re-register the data list since all the custom elements are cleared before any test
    //     defineCustomElement('wcl-data-list', DataList);

    //     // Attach it to the DOM
    //     document.body.innerHTML = '<wcl-data-list id="dg2"  id-field="name" data="getData()" fields="getFields()"></wcl-data-list>';

    //     // Test the element
    //     const component: any = document.querySelector('wcl-data-list');

    //     await component.updateComplete; // Wait for the component to render

    //     expect(component.shadowRoot.innerHTML).toBe("<style>[object Object]</style><!--_$bm_--><wcl-data-header fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\"></wcl-data-header><!--_$em_--><!--_$bm_--><wcl-data-row fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\" record=\"{&quot;name&quot;:&quot;Sarah&quot;,&quot;age&quot;:19,&quot;description&quot;:&quot;Smart and beautiful&quot;}\" key=\"Sarah\"></wcl-data-row><wcl-data-row fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\" record=\"{&quot;name&quot;:&quot;Mark&quot;,&quot;age&quot;:31,&quot;description&quot;:&quot;Hard worker&quot;}\" key=\"Mark\"></wcl-data-row><!--_$em_-->");

    //     component.data = [
    //         {
    //             name: "Mark",
    //             age: 31,
    //             description: 'Hard worker'
    //         },
    //         {
    //             name: "Sarah",
    //             age: 19,
    //             description: 'Smart and beautiful'
    //         }
    //     ];

    //     await component.updateComplete; // Wait for the component to render

    //     expect(component.shadowRoot.innerHTML).toBe("<style>[object Object]</style><!--_$bm_--><wcl-data-header fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\"></wcl-data-header><!--_$em_--><!--_$bm_--><wcl-data-row fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\" record=\"{&quot;name&quot;:&quot;Mark&quot;,&quot;age&quot;:31,&quot;description&quot;:&quot;Hard worker&quot;}\" key=\"Mark\"></wcl-data-row><wcl-data-row fields=\"[&quot;name&quot;,&quot;age&quot;,&quot;description&quot;]\" record=\"{&quot;name&quot;:&quot;Sarah&quot;,&quot;age&quot;:19,&quot;description&quot;:&quot;Smart and beautiful&quot;}\" key=\"Sarah\"></wcl-data-row><!--_$em_-->");
    // });
});