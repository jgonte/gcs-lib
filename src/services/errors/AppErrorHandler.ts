import html from "../../rendering/html";
import appCtrl from "../appCtrl";
import ErrorHandler, { errorEvent } from "./ErrorHandler";

export default class AppErrorHandler implements ErrorHandler {

    constructor() {

        (document as Document).addEventListener(errorEvent, this.handleError as EventListenerOrEventListenerObject);
    }

    handleError(event: CustomEvent): void {

        const {
            error
        } = event.detail;

        const content = () => html`<wcl-alert kind="danger" close>${error.message}</wcl-alert>`;

        appCtrl.showDialog(content);
    }
}