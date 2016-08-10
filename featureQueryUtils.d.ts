declare namespace featureQueryUtils {
    /**
     * Downloads a feature set from a feature layer.
     * @function
     * @param {string} url - The URL to a feature layer.
     * @return {Promise.<ArcGis.Rest.FeatureSet>} - Returns a feature set.
     * @example
     * var promise = featureQueryUtils.downloadFeatures("http://data.example.com/arcgis/rest/services/Shared/CountyBoundaries/MapServer/0");
     * promise.then(function (featureSet) {
     *     console.debug("featureSet", featureSet);
     * }, function (error) {
     *     console.error(error);
     * });
     */
    function downloadFeatures(url: string): Promise<ArcGis.Rest.FeatureSet>
}

declare module "featureQueryUtils" {
    export = featureQueryUtils
}