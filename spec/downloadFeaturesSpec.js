/*eshint-env jasmine*/
var downloadFeatures = require("../downloadFeatures.js");

describe("test downloadFeatures", function () {
    it("should work", function (done) {
        downloadFeatures("http://data.wsdot.wa.gov/arcgis/rest/services/Shared/CountyBoundaries/MapServer/0").then(function (featureSet) {
            expect(featureSet).toBeTruthy();
            expect(Array.isArray(featureSet.features)).toBe(true);
            expect(featureSet.features.length).toBeGreaterThan(0);
            done();
        }, function (error) {
            done.fail(error);
        });
    });
});