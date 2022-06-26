import CustomElementPropertyMetadata from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../../rendering/html";
import { DataTypes } from "../../../utils/data/DataTypes";
import { ErrorResponse } from "../../../utils/data/transfer/ErrorResponse";
import Fetcher from "../../../utils/data/transfer/Fetcher";
import { GenericRecord } from "../../../utils/types";

export default function LoadableHolder<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class LoadableHolderMixin extends Base {


        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * The URL to retrieve the data from
                 */
                loadUrl: {
                    attribute: 'load-url',
                    type: DataTypes.String,
                    //required: true Loading the form or other component might be optional
                },

                /**
                 * Whether to load the data for the component when the component is connected
                 */
                autoLoad: {
                    attribute: 'auto-load',
                    type: DataTypes.Boolean,
                    value: true
                }
            };
        }

        static get state(): Record<string, CustomElementStateMetadata> {

            return {

                loading: {
                    value: false
                }
            };
        }

        renderLoading() {

            if (this.loading === false) {

                return null;
            }

            return html`<wcl-overlay>
                <wcl-alert kind="info" >...Loading</wcl-alert>
            </wcl-overlay>`;
        }

        connectedCallback() {

            super.connectedCallback?.();

            if (this.loadUrl === undefined) {

                return;
            }

            this._loadFetcher = new Fetcher({
                onData: data => this.handleLoadData(data),
                onError: error => this.handleLoadError(error)
            });

            if (this.autoLoad === true) { // Wait until all the fields were added

                setTimeout(() => this.load(), 0); // Wait for the next refresh to load
            }
        }

        load() {

            this.error = undefined; // Clear any previous error

            this.loading = true;

            this._loadFetcher.fetch({
                url: this.loadUrl
            });
        }

        handleLoadData(data: GenericRecord) {

            this.loading = false;

            this.handleLoadedData(data);
        }

        handleLoadError(error: ErrorResponse) {

            this.loading = false;

            this.error = error;
        }
    }
}