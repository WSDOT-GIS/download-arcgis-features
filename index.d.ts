import { IFeatureSet } from 'arcgis-rest-api-ts-d';

/**
 * Downloads a feature set from a feature layer.
 * @function
 * @param {string} url - The URL to a feature layer.
 * @return {Promise.<IFeatureSet>} - Returns a feature set.
 * @example
 * var promise = featureQueryUtils.downloadFeatures("http://data.example.com/arcgis/rest/services/Shared/CountyBoundaries/MapServer/0");
 * promise.then(function (featureSet) {
 *     console.debug("featureSet", featureSet);
 * }, function (error) {
 *     console.error(error);
 * });
 * @example
 * try {
 *      let featureSet = await featureQueryUtils.downloadFeatures("http://data.example.com/arcgis/rest/services/Shared/CountyBoundaries/MapServer/0");
 *      console.debug("featureSet", featureSet);
 * } catch (error) {
 *     console.error(error);
 * }
 */
export function downloadFeatures(url: string): Promise<IFeatureSet>
