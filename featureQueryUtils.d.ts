import { IFeatureSet } from "arcgis-rest-api-ts-d";
export interface IObjectIdsResponse extends IFeatureSet {
    objectIds: number[];
    objectIdFieldName: string;
}
/**
 * Downloads services from a feature layer.
 * @param url URL to a map or feature service layer.
 */
export declare function downloadFeatures(url: string): Promise<IFeatureSet>;
