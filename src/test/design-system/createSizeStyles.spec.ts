import Button from "../../components/button/Button";
import createSizeStyles from "../../design-system/createSizeStyles";

describe("createSizeStyles tests", () => {

    it('should output the styles for a button of primary kind', () => {

        const styles = createSizeStyles(Button);

        expect(styles).toEqual("\n:host {\n    min-height: var(--wcl-min-height);\n}\n\n:host {\n    margin: var(--wcl-margin);\n}\n\n:host([size='large']) {\n    font-size: var(--wcl-font-size-large);\n}\n\n:host([size='medium']) {\n    font-size: var(--wcl-font-size-medium);\n}\n\n:host([size='small']) {\n    font-size: var(--wcl-font-size-small);\n}");
    });
});