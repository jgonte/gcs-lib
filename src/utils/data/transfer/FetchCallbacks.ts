import { ErrorResponse } from "./ErrorResponse";

/**
 * Callbacks to be implemented in order to handle the different fetch scenarios
 */
 export interface FetchCallbacks {

    onResponse?: (response: Response) => void;

    onError?: (error: ErrorResponse) => void;

    onData?: (data: Record<string, unknown>) => void;
}