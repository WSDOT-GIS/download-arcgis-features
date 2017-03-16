/**
 * Utilities for querying map service / feature service layers.
 * @module featureQueryUtils
 */

if (!fetch) {
    // tslint:disable-next-line:no-var-keyword no-var-requires
    var fetch = require("node-fetch");
}
import { IFeatureSet, ILayer } from "arcgis-rest-api-ts-d";

export interface IObjectIdsResponse extends IFeatureSet {
    objectIds: number[];
    objectIdFieldName: string;
};

/**
 * Converts an object into a query string.
 * @param {Object} o - An object
 * @returns {string} - A query string.
 */
function objectToQuery(o: { [key: string]: any }) {
    let params = [];
    for (let name in o) {
        if (o.hasOwnProperty(name)) {
            let v = encodeURIComponent(o[name]);
            params.push([name, v].join("="));
        }
    }
    return params.join("&");
}

const maxUrlChars = 2048;

/**
 * Gets all of the object IDs from a feature layer.
 * @param {string} url - The URL of a feature layer.
 * @returns {Promise.<number[]>} - A promise that resolves to an array of numbers.
 */
async function getIds(url: string) {
    let query = {
        where: "1=1",
        returnIdsOnly: true,
        f: "json"
    };
    url = [url + "/query", objectToQuery(query)].join("?");

    let response = await fetch(url);
    let data = await response.json();
    return data as IObjectIdsResponse;
}

/**
 * Gets info about a feature layer.
 * @param {string} url - A map/feature service layer URL.
 * @returns {Promise.<object>} - An object with the properties of the feature layer.
 */
async function getServiceInfo(url: string) {
    url = [url, "f=json"].join("?");

    let response = await fetch(url);
    return await response.json() as ILayer;
}

async function queryFeatures(url: string, queryParameters: { [key: string]: any }) {
    if (!queryParameters.f) {
        queryParameters.f = "json";
    }
    let params = objectToQuery(queryParameters);
    let queryUrl = [url, "query"].join("/");
    let response: Response;
    if (queryUrl.length + params.length + 1 > maxUrlChars) {
        response = await fetch(queryUrl, {
            method: "POST",
            body: params,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    } else {
        response = await fetch([queryUrl, params].join("?"));
    }
    return await response.json() as IFeatureSet;
}

async function downloadData(url: string, oids: number[], oidFieldName: string, maxRecordCount: number) {
    let promises = [];
    let promise;

    if (oids.length <= maxRecordCount) {
        promises = [queryFeatures(url, {
            where: "1=1",
            outFields: "*"
        })];
    } else {
        for (let i = 0, l = oids.length; i < l; i += maxRecordCount) {
            let currentIds = oids.slice(i, i + maxRecordCount);
            let where = `${oidFieldName} IN ${currentIds.join(",")}`;
            if (/\(\s*\)/.test(where)) {
                throw new Error("Invalid where statement:" + where);
            }
            promise = queryFeatures(url, {
                where,
                outFields: "*"
            });
            promises.push(promise);
        }
    }
    return await Promise.all(promises);
}

/**
 * Downloads services from a feature layer.
 * @param url URL to a map or feature service layer.
 */
export async function downloadFeatures(url: string) {
    let [serviceInfo, idsData] = await Promise.all([getServiceInfo(url), getIds(url)]);

    let oids = idsData.objectIds;
    let oidFieldName = idsData.objectIdFieldName;
    let maxRecordCount = serviceInfo.maxRecordCount;

    let featureSets = await downloadData(url, oids, oidFieldName, maxRecordCount);
    let mainFS = featureSets[0];
    for (let i = 1, l = featureSets.length; i < l; i += 1) {
        mainFS.features = mainFS.features.concat(featureSets[i].features);
    }
    return mainFS;
}
