(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals
        root.downloadFeatures = factory();
    }
}(this, function () {
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
     * @parm {string} url - The URL of a feature layer.
     * @returns {Promise.<number[]>} - A promise that resolves to an array of numbers.
     */
    function getIds(url) {
        var query = {
            where: "1=1",
            returnIdsOnly: true,
            f: "json"
        };
        url = [url + "/query", objectToQuery(query)].join("?");

        var promise = new Promise(function (resolve, reject) {

            var request = new XMLHttpRequest();
            request.open("get", url);
            request.onloadend = function () {
                var response = JSON.parse(this.response);
                response.url = url;
                resolve(response);
            };
            request.onerror = function (e) {
                reject(e);
            };
            request.send();
        });

        return promise;
    }

    /**
     * Gets info about a feature layer.
     * @param {string} url - A map/feature service layer URL.
     * @returns {Promise.<object>} - An object with the properties of the feature layer.
     */
    function getServiceInfo(url) {
        url = [url, "f=json"].join("?");

        var promise = new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open("get", url);
            request.onloadend = function () {
                var response = JSON.parse(this.response);
                response.url = url;
                resolve(response);
            };
            request.onerror = function (e) {
                reject(e);
            };
            request.send();
        });

        return promise;
    }

    function queryFeatures(url, queryParameters) {
        if (!queryParameters.f) {
            queryParameters.f = "json";
        }
        var params = objectToQuery(queryParameters);
        var promise = new Promise(function (resolve, reject) {
            var request = new XMLHttpRequest();
            request.open("POST", [url, "query"].join("/"));
            request.onloadend = function () {
                var response = JSON.parse(this.response);
                response.url = url;
                resolve(response);
            };
            request.onerror = function (e) {
                reject(e);
            };
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.send(params);
        });
        return promise;
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

    /**
     * @module downloadFeatures
     */

    /**
     * Downloads a feature set from a feature layer.
     * @alias module:downloadFeatures
     * @param {string} url - The URL to a feature layer.
     * @return {Promise.<FeatureSet>} - Returns a feature set.
     */
    function downloadFeatures(url) {
        return new Promise(function (resolve, reject) {
            Promise.all([getServiceInfo(url), getIds(url)]).then(function (e) {
                var serviceInfo = e[0];
                var idsData = e[1];
                var oids = idsData.objectIds;
                var oidFieldName = idsData.objectIdFieldName;
                var maxRecordCount = serviceInfo.maxRecordCount;

                downloadData(url, oids, oidFieldName, maxRecordCount).then(function (featureSets) {
                    console.log("download data completed", e);
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

    return downloadFeatures;
}));

