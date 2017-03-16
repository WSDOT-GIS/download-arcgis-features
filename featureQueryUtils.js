/**
 * Utilities for querying map service / feature service layers.
 * @module featureQueryUtils
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    if (!fetch) {
        // tslint:disable-next-line:no-var-keyword no-var-requires
        var fetch = require("node-fetch");
    }
    ;
    /**
     * Converts an object into a query string.
     * @param {Object} o - An object
     * @returns {string} - A query string.
     */
    function objectToQuery(o) {
        var params = [];
        for (var name_1 in o) {
            if (o.hasOwnProperty(name_1)) {
                var v = encodeURIComponent(o[name_1]);
                params.push([name_1, v].join("="));
            }
        }
        return params.join("&");
    }
    var maxUrlChars = 2048;
    /**
     * Gets all of the object IDs from a feature layer.
     * @param {string} url - The URL of a feature layer.
     * @returns {Promise.<number[]>} - A promise that resolves to an array of numbers.
     */
    function getIds(url) {
        return __awaiter(this, void 0, void 0, function () {
            var query, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = {
                            where: "1=1",
                            returnIdsOnly: true,
                            f: "json"
                        };
                        url = [url + "/query", objectToQuery(query)].join("?");
                        return [4 /*yield*/, fetch(url)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    }
    /**
     * Gets info about a feature layer.
     * @param {string} url - A map/feature service layer URL.
     * @returns {Promise.<object>} - An object with the properties of the feature layer.
     */
    function getServiceInfo(url) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = [url, "f=json"].join("?");
                        return [4 /*yield*/, fetch(url)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    function queryFeatures(url, queryParameters) {
        return __awaiter(this, void 0, void 0, function () {
            var params, queryUrl, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!queryParameters.f) {
                            queryParameters.f = "json";
                        }
                        params = objectToQuery(queryParameters);
                        queryUrl = [url, "query"].join("/");
                        if (!(queryUrl.length + params.length + 1 > maxUrlChars)) return [3 /*break*/, 2];
                        return [4 /*yield*/, fetch(queryUrl, {
                                method: "POST",
                                body: params,
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded"
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, fetch([queryUrl, params].join("?"))];
                    case 3:
                        response = _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, response.json()];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    function downloadData(url, oids, oidFieldName, maxRecordCount) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, promise, i, l, currentIds, where;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        if (oids.length <= maxRecordCount) {
                            promises = [queryFeatures(url, {
                                    where: "1=1",
                                    outFields: "*"
                                })];
                        }
                        else {
                            for (i = 0, l = oids.length; i < l; i += maxRecordCount) {
                                currentIds = oids.slice(i, i + maxRecordCount);
                                where = oidFieldName + " IN " + currentIds.join(",");
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
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    /**
     * Downloads services from a feature layer.
     * @param url URL to a map or feature service layer.
     */
    function downloadFeatures(url) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, serviceInfo, idsData, oids, oidFieldName, maxRecordCount, featureSets, mainFS, i, l;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([getServiceInfo(url), getIds(url)])];
                    case 1:
                        _a = _b.sent(), serviceInfo = _a[0], idsData = _a[1];
                        oids = idsData.objectIds;
                        oidFieldName = idsData.objectIdFieldName;
                        maxRecordCount = serviceInfo.maxRecordCount;
                        return [4 /*yield*/, downloadData(url, oids, oidFieldName, maxRecordCount)];
                    case 2:
                        featureSets = _b.sent();
                        mainFS = featureSets[0];
                        for (i = 1, l = featureSets.length; i < l; i += 1) {
                            mainFS.features = mainFS.features.concat(featureSets[i].features);
                        }
                        return [2 /*return*/, mainFS];
                }
            });
        });
    }
    exports.downloadFeatures = downloadFeatures;
});
