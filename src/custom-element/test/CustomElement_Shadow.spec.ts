import CustomElement from "../CustomElement";
import defineCustomElement from "../defineCustomElement";
import CustomElementComponentMetadata from "../mixins/metadata/types/CustomElementComponentMetadata";
import clearCustomElements from "./helpers/clearCustomElements";

beforeEach(() => {

    clearCustomElements();
});

describe("CustomElement shadow tests", () => {

    it('should have the shadow flag true by default', () => {

        class A extends CustomElement {

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        expect(A.metadata.shadow).toBe(true);     
    });

    it('should have the shadow flag false when it is explicitly set', () => {

        class A extends CustomElement {

            static get component() : CustomElementComponentMetadata {

                return {

                    shadow: false
                };
            }

            render(): null {

                return null;
            }
        }

        defineCustomElement('test-a', A);

        expect(A.metadata.shadow).toBe(false);
    });
});