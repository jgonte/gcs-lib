/**
 * Describes the configurator of the state
 */
 export default interface CustomElementStateMetadata {

    /**
     * The name of the property in the state object
     */
    name?: string;

    /**
     * The default value of the state
     */
    value: unknown;
}