(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('node-fetch'));
    } else {
        // Browser globals
        root.featureQueryUtils = factory();
    }
}(this, function (fetchPolyfill) {

    /**
     * Utilities for querying map service / feature service layers.
     * @module featureQueryUtils
     */

    var maxUrlChars = 2048;

    if (fetchPolyfill) {
        fetch = fetchPolyfill;
    }

    /**
     * @external FeatureSet
     * @see {@link http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/FeatureSet_object/02r3000002mn000000/ FeatureSet object}
     */

    /**
     * Converts an object into a query string.
     * @param {Object} o - An object
     * @returns {string} - A query string.
     */
    function objectToQuery(o) {
        var v, params = [];
        for (var name in o) {
            if (o.hasOwnProperty(name)) {
                v = encodeURIComponent(o[name]);
                params.push([name, v].join("="));
            }
        }
        return params.join("&");
    }

    /**
     * Gets all of the object IDs from a feature layer.
     * @param {string} url - The URL of a feature layer.
     * @returns {Promise.<number[]>} - A promise that resolves to an array of numbers.
     */
    function getIds(url) {
        var query = {
            where: "1=1",
            returnIdsOnly: true,
            f: "json"
        };
        url = [url + "/query", objectToQuery(query)].join("?");

        return fetch(url).then(function (response) {
            return response.json();
        });
    }

    /**
     * Gets info about a feature layer.
     * @param {string} url - A map/feature service layer URL.
     * @returns {Promise.<object>} - An object with the properties of the feature layer.
     */
    function getServiceInfo(url) {
        url = [url, "f=json"].join("?");

        return fetch(url).then(function (response) {
            return response.json();
        });
    }

    function queryFeatures(url, queryParameters) {
        if (!queryParameters.f) {
            queryParameters.f = "json";
        }
        var params = objectToQuery(queryParameters);
        var queryUrl = [url, "query"].join("/");
        var promise;
        if (queryUrl.length + params.length + 1 > maxUrlChars) {
            promise = fetch(queryUrl, {
                method: "POST",
                body: params,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        } else {
            promise = fetch([queryUrl, params].join("?"));
        }
        return promise.then(function (response) {
            return response.json();
        });
    }

    function downloadData(url, oids, oidFieldName, maxRecordCount) {
        var promises = [];
        var promise;

        var i, l, currentIds, where;
        if (oids.length <= maxRecordCount) {
            promises = [queryFeatures(url, {
                where: "1=1",
                outFields: "*"
            })];
        } else {
            for (i = 0, l = oids.length; i < l; i += maxRecordCount) {
                currentIds = oids.slice(i, i + maxRecordCount);
                where = [oidFieldName, " IN (", currentIds.join(","), ")"].join("");
                if (/\(\s*\)/.test(where)) {
                    throw new Error("Invalid where statement:" + where);
                }
                promise = queryFeatures(url, {
                    where: where,
                    outFields: "*"
                });
                promises.push(promise);
            }
        }
        promise = Promise.all(promises);

        return promise;
    }


    function downloadFeatures(url) {
        return new Promise(function (resolve, reject) {
            Promise.all([getServiceInfo(url), getIds(url)]).then(function (e) {
                var serviceInfo = e[0];
                var idsData = e[1];
                var oids = idsData.objectIds;
                var oidFieldName = idsData.objectIdFieldName;
                var maxRecordCount = serviceInfo.maxRecordCount;

                downloadData(url, oids, oidFieldName, maxRecordCount).then(function (featureSets) {
                    var mainFS = featureSets[0];
                    for (var i = 1, l = featureSets.length; i < l; i += 1) {
                        mainFS.features = mainFS.features.concat(featureSets[i].features);
                    }
                    resolve(mainFS);
                });
            }, function (err) {
                reject(err);
            });
        });
    }



    return {
        /**
         * Downloads a feature set from a feature layer.
         * @function
         * @param {string} url - The URL to a feature layer.
         * @return {Promise.<external:FeatureSet>} - Returns a feature set.
         * @example
         * var promise = featureQueryUtils.downloadFeatures("http://data.example.com/arcgis/rest/services/Shared/CountyBoundaries/MapServer/0");
         * promise.then(function (featureSet) {
         *     console.debug("featureSet", featureSet);
         * }, function (error) {
         *     console.error(error);
         * });
         */
        downloadFeatures: downloadFeatures
    };
}));

