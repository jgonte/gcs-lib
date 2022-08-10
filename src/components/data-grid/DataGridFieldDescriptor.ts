import { NodePatchingData } from "../../rendering/nodes/NodePatchingData";
import { GenericRecord } from "../../utils/types";

export default interface DataGridFieldDescriptor {

    /**
     * The name of the field
     */
    name: string;

    /**
     * The display (label) of the field
     */
    display: string | (() => NodePatchingData);

    /**
     * The CSS width of the field
     */
    width: string;

    /**
     * Whether the field can be sorted
     */
    sortable: boolean;

    /**
     * The style for the header of the field (column)
     */
    headerStyle: string | GenericRecord;

    /**
     * The custom renderer of the field
     */
    render: (value: unknown, record: Record<string, any>, field: DataGridFieldDescriptor) => NodePatchingData;
}