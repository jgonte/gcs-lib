export type ReturnedObjectData = object & Record<string, unknown>;

export type ReturnedData = ReturnedObjectData | ReturnedObjectData[];

export interface DataProvider {

    getData(): ReturnedData;
}