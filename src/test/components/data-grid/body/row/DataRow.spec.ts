import DataCell from "../../../../../components/data-grid/body/cell/DataCell";
import DataRow from "../../../../../components/data-grid/body/row/DataRow";
import CustomElement from "../../../../../custom-element/CustomElement";
import defineCustomElement from "../../../../../custom-element/defineCustomElement";
import { GenericRecord } from "../../../../../utils/types";
import clearCustomElements from "../../../../custom-element/helpers/clearCustomElements";
import getContentWithoutStyle from "../../../helpers/getContentWithoutStyle";

beforeEach(() => {

    clearCustomElements();
});

describe("Data row tests", () => {

    // it('should throw an error when the record and field attributes are not provided', () => {

    //     // Re-register the data row and its dependencies since all the custom elements are cleared before any test
    //     defineCustomElement('wcl-data-cell', DataCell);

    //     defineCustomElement('wcl-data-row', DataRow);

    //     expect(() => {

    //         // Attach it to the DOM
    //         document.body.innerHTML = `<wcl-data-row></wcl-data-row>`;

    //     }).toThrow(new Error("The attributes: [record, fields] must have a value"));
    // });

    it('should render when the data of the attributes is provided', async () => {

        // Re-register the data row since all the custom elements are cleared before any test
        defineCustomElement('wcl-data-cell', DataCell);

        defineCustomElement('wcl-data-row', DataRow);

        const fields = [
            "name", 
            "age", 
            "description"
        ];

        const data = { 
            name: "Sarah", 
            age: "19", "description": "Beautiful and smart" };

        // Attach it to the DOM
        document.body.innerHTML = `
        <wcl-data-row id="dr1" 
            record='${JSON.stringify(data)}'
            fields='${JSON.stringify(fields)}'
        >
        </wcl-data-row>`;

        // Test the element
        const component = document.querySelector('wcl-data-row') as CustomElement;

        expect(component.fields).toEqual(fields);

        expect(component.data).toEqual(data);

        await component.updateComplete; // Wait for the component to render

        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<wcl-data-cell field=\"name\" key=\"name\"></wcl-data-cell><wcl-data-cell field=\"age\" key=\"age\"></wcl-data-cell><wcl-data-cell field=\"description\" key=\"description\"></wcl-data-cell>");
    });

    it('should render when the data of the attributes is provided via functions', async () => {

        // Set up the functions to be called
        (window as unknown as GenericRecord).getRecord = function () {

            return {
                name: "Sarah",
                age: 19,
                description: 'Smart and beautiful'
            };
        };

        (window as unknown as GenericRecord).getFields = function () {

            return ["name", "age", "description"];
        };

        // Re-register the data row since all the custom elements are cleared before any test
        defineCustomElement('wcl-data-cell', DataCell);

        defineCustomElement('wcl-data-row', DataRow);

        // Attach it to the DOM
        document.body.innerHTML = '<wcl-data-row id="dr2" record="getRecord()" fields="getFields()"></wcl-data-row>';

        // Test the element
        const component = document.querySelector('wcl-data-row') as CustomElement;

        await component.updateComplete; // Wait for the component to render

        const contentWithoutStyle = getContentWithoutStyle(component.shadowRoot?.innerHTML);

        expect(contentWithoutStyle).toBe("<wcl-data-cell field=\"name\" key=\"name\"></wcl-data-cell><wcl-data-cell field=\"age\" key=\"age\"></wcl-data-cell><wcl-data-cell field=\"description\" key=\"description\"></wcl-data-cell>");

        const data = {
            name: "Sasha",
            age: 2,
            description: 'Little giant'
        };

        const spySetProperty = jest.spyOn(component, 'setProperty');

        component.record = data;

        expect(spySetProperty).toHaveBeenCalledTimes(1);

        expect(spySetProperty).toHaveBeenCalledWith('record', data);

        expect(component._properties.record).toEqual(data); // Test the data 
    });
});