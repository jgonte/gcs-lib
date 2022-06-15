import CustomElementPropertyMetadata, { ConversionTypes } from "../../../custom-element/mixins/metadata/types/CustomElementPropertyMetadata";
import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import html from "../../../rendering/html";
import { ErrorResponse } from "../../../utils/data/transfer/ErrorResponse";
import Fetcher from "../../../utils/data/transfer/Fetcher";
import { GenericRecord } from "../../../utils/types";

export default function Submittable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class SubmittableMixin extends Base {


        static get properties(): Record<string, CustomElementPropertyMetadata> {

            return {

                /**
                 * The URL to post the data to
                 */
                submitUrl: {
                    attribute: 'submit-url',
                    type: ConversionTypes.String,
                    required: true
                },

                method: {
                    type: [
                        ConversionTypes.String, 
                        ConversionTypes.Function
                    ],
                    options: ['post', 'put']
                }
            };
        }

        static get state(): Record<string, CustomElementStateMetadata> {

            return {

                submitting: {
                    value: false
                }
            };
        }

        renderSubmitting() {

            const {
                submitting
            } = this;

            if (submitting === false) {

                return null;
            }

            return html`<wcl-overlay>
                <wcl-alert kind="info" >...Submitting</wcl-alert>
            </wcl-overlay>`;
        }

        connectedCallback() {

            super.connectedCallback?.();

            this._submitFetcher = new Fetcher({
                onData: data => this.handleSubmitData(data),
                onError: error => this.handleSubmitError(error)
            });
        }

        submit() {

            this.error = undefined; // Clear any previous error

            this.submitting = true;

            const data = this.getSubmitData(); // Overriden by the derived classes

            this._submitFetcher.fetch({
                url: this.submitUrl,
                method: this.getMethod(data),
                data
            });
        }

        getMethod(data: GenericRecord) {

            const {
                method
            } = this;

            if (method !== undefined) {

                return typeof method === 'function' ?
                    method() :
                    method; // The user set an specific method
            }

            // Use conventions
            return data.id !== undefined ? 'put' : 'post';
        }

        handleSubmitData(data: GenericRecord) {

            this.submitting = false;

            this.handleSubmitResponse(data);
        }

        handleSubmitError(error: ErrorResponse) {

            this.submitting = false;

            this.error = error;
        }
    }
}