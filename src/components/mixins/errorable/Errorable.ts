import CustomElementStateMetadata from "../../../custom-element/mixins/metadata/types/CustomElementStateMetadata";
import CustomHTMLElementConstructor from "../../../custom-element/mixins/metadata/types/CustomHTMLElementConstructor";
import { errorEvent } from "../../../services/errors/ErrorHandler";

/**
 * Mixin that handles errors
 * @param Base 
 */
 export default function Errorable<TBase extends CustomHTMLElementConstructor>(Base: TBase): TBase {

    return class ErrorableMixin extends Base {

        static get state() : Record<string, CustomElementStateMetadata> {

            return {

                error: {
                    value: undefined
                }
            };
        }

        renderError() : void{

            const {
                error
            } = this;

            if (error !== undefined) {

                this.dispatchCustomEvent(errorEvent, {
                    error: {
                        message: this.getErrorMessage(error)
                    }
                });

                this.error = undefined; // Clear the error
            }
        }

        /**
         * Extracts the error message from the error object
         * @returns The error message from the server
         */
        getErrorMessage(error: Error | { payload?: string; statusText?: string } | string) : string {

            if (typeof error === 'string') {

                return error;
            }
            if (error instanceof Error) {

                return error.message;
            }
            else { // Try to find the message of error returned by the server

                if (error.payload !== undefined) {

                    if (typeof error.payload === 'string') {

                        return error.payload;
                    }
                    else {

                        const payload = JSON.parse(error.payload);

                        if (payload.errors !== undefined) {

                            return Object.values(payload.errors).join('\n');
                        }
                        else if (payload.title !== undefined) {

                            return payload.title;
                        }
                    }
                }
                else {

                    return error.statusText as string;
                }
            }

            throw new Error(`getErrorMessage - Unhandled error: ${error}`);
        }

    };
}
