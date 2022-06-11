import ErrorHandler, { errorEvent } from "./ErrorHandler";

export default class AppErrorHandler implements ErrorHandler {

    constructor() {

        (document as Document).addEventListener(errorEvent, this.handleError as EventListenerOrEventListenerObject);
    }

    handleError(event: CustomEvent): void {

        const {
            error
        } = event.detail;

        alert(error.message);
    }
}