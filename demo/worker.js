/*global self*/

importScripts("../featureQueryUtils.js");

self.addEventListener("message", function (e) {
    console.log("Message recieved.", e);
    var url = e.data.url;
    if (e.data.operation === "download") {
        featureQueryUtils.downloadFeatures(url).then(function (featureSet) {
            self.postMessage({ message: "download complete", features: featureSet });
            self.close();
        }, function (err) {
            self.postMessage({ message: "error", error: err.message });
            self.close();
        });
    }
});