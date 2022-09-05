import CustomElement from "../../custom-element/CustomElement";
import defineCustomElement from "../../custom-element/defineCustomElement";
import CustomElementPropertyMetadata from "../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomHTMLElementConstructor from "../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import mergeStyles from "../../custom-element/styles/mergeStyles";
import html from "../../rendering/html";
import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import appCtrl from "../../services/appCtrl";
import IntlProvider from "../../services/IntlProvider";
import { DataTypes } from "../../utils/data/DataTypes";
import Sizable from "../mixins/sizable/Sizable";
import { localizedTextStyles } from "./LocalizedText.styles";

export default class LocalizedText extends
    Sizable(
        CustomElement as CustomHTMLElementConstructor
    ) {

    static get styles(): string {

        return mergeStyles(super.styles, localizedTextStyles);
    }

    static get properties(): Record<string, CustomElementPropertyMetadata> {

        return {

            /**
             * The key to retrieve a localized value from an i18n provider
             */
            intlKey: {
                attribute: 'intl-key',
                type: DataTypes.String
            },

            /**
             * The language to translate to
             */
            lang: {
                type: DataTypes.String,
                reflect: true
            },

            /**
             * The value of the translated resource
             */
            value: {
                type: DataTypes.String,
                reflect: true
            }
        };
    }

    connectedCallback() {

        super.connectedCallback?.();

        const {
            intlKey
        } = this;

        if (intlKey !== undefined) {

            const {
                intlProvider
            } = appCtrl;

            intlProvider?.subscribe(this);

            const lang = this.lang || intlProvider?.lang;

            this.value = intlProvider?.getTranslation(lang, intlKey);
        }
    }

    disconnectedCallback() {

        super.disconnectedCallback?.();

        const {
            intlKey
        } = this;

        if (intlKey) {

            appCtrl.intlProvider?.unsubscribe(this);
        }
    }

    render(): NodePatchingData {

        const {
            value
        } = this;

        if (value === undefined) {

            return html`<slot></slot>`;
        }
        else {

            return html`${value}`;
        }
    }

    handleLanguageChanged(provider: IntlProvider) {

        const {
            intlKey,
            lang
        } = this;

        this.value = provider.getTranslation(lang, intlKey);
    }
}

defineCustomElement('wcl-localized-text', LocalizedText);