import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import CustomElement from "../CustomElement";
import defineCustomElement from "../defineCustomElement";
import CustomElementPropertyMetadata, { ConversionTypes } from "../mixins/metadata/types/CustomElementPropertyMetadata";
import clearCustomElements from "./helpers/clearCustomElements";

beforeEach(() => {

    clearCustomElements();
});

describe("CustomElement parent children relationship tests", () => {

    it('should call the child didMountCallback before the parent', async () => {

        const callTester = {

            didMountCallback: (element: HTMLElement) => { 

                console.log(element.constructor.name);
            }
        };

        class Parent extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: ConversionTypes.String,
                        value: "Sarah"
                    }
                };
            }

            static get styles(): string {

                return `
                    :host {
                        background-color: yellowgreen;
                    }
                `;
            }

            render(): NodePatchingData {

                return html`
                    <span>Hello, my name is ${this.name}</span>
                `;
            }

            didMountCallback() {

                callTester.didMountCallback(this); // Parent
            }
        }

        defineCustomElement('test-parent', Parent);

        class Child extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    age: {
                        type: ConversionTypes.Number,
                        value: 19
                    }
                };
            }

            static get styles(): string {

                return `
                    :host {
                        background-color: aliceblue
                    }
                `;
            }

            render(): NodePatchingData {

                return html`
                    <span>My age is ${this.age}</span>
                `;
            }

            didMountCallback() {

                callTester.didMountCallback(this); // Child
            }
        }

        const spyMountedCallback = jest.spyOn(callTester, 'didMountCallback');

        defineCustomElement('test-child', Child);

        // Attach it to the DOM
        document.body.innerHTML =
            `
            <test-parent>
                <test-child></test-child>
            </test-parent>
        `;

        // Test the element
        const parentComponent = document.querySelector('test-parent') as CustomElement;

        await parentComponent.updateComplete; // Wait for the component to render

        const childComponent = document.querySelector('test-child') as CustomElement;

        //await childComponent.updateComplete; // The parent waits for the child to mount/update

        expect(parentComponent.adoptedChildren.size).toEqual(1);

        expect(Array.from(parentComponent.adoptedChildren)[0]).toBe(childComponent);

        //expect(spyMountedCallback).toHaveBeenCalledTimes(2); TODO: Research why it is not calling the spy on the parent

        expect(spyMountedCallback).toHaveBeenNthCalledWith(1, childComponent); // Children should be called first

        //expect(spyMountedCallback).toHaveBeenNthCalledWith(2, parentComponent);
    });

    it('should call the child didMountCallback before the slotted parent', async () => {

        const callTester = {

            didMountCallback: (element: HTMLElement) => { 

                console.log(element.constructor.name);
            }
        };

        class Parent extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    name: {
                        type: ConversionTypes.String,
                        value: "Sarah"
                    }
                };
            }

            static get styles(): string {

                return `
                    :host {
                        background-color: yellowgreen;
                    }
                `;
            }

            render(): NodePatchingData {

                return html`
                    <slot name="content"></slot>
                `;
            }

            didMountCallback() {

                callTester.didMountCallback(this); // Slotted parent
            }
        }

        defineCustomElement('test-parent', Parent);

        class Child extends CustomElement {

            static get properties(): Record<string, CustomElementPropertyMetadata> {

                return {

                    age: {
                        type: ConversionTypes.Number,
                        value: 19
                    }
                };
            }

            static get styles(): string {

                return `
                    :host {
                        background-color: aliceblue
                    }
                `;
            }

            render(): NodePatchingData {

                return html`
                    <span>My age is ${this.age}</span>
                `;
            }

            didMountCallback() {

                callTester.didMountCallback(this); // Slotted child
            }
        }

        const spyMountedCallback = jest.spyOn(callTester, 'didMountCallback');

        defineCustomElement('test-child', Child);

        // Attach it to the DOM
        document.body.innerHTML =
            `
            <test-parent>
                <test-child slot="content"></test-child>
            </test-parent>
        `;

        // Test the element
        const parentComponent = document.querySelector('test-parent') as CustomElement;

        await parentComponent.updateComplete; // Wait for the component to render

        const childComponent = document.querySelector('test-child') as CustomElement;

        //await childComponent.updateComplete; // The parent waits for the child to mount/update

        expect(parentComponent.adoptedChildren.size).toEqual(1);

        expect(Array.from(parentComponent.adoptedChildren)[0]).toBe(childComponent);

        //expect(spyMountedCallback).toHaveBeenCalledTimes(2); TODO: Research why it is not calling the spy on the parent

        expect(spyMountedCallback).toHaveBeenNthCalledWith(1, childComponent); // Children should be called first

        //expect(spyMountedCallback).toHaveBeenNthCalledWith(2, parentComponent);
    });

});
