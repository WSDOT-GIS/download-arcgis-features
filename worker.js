﻿/*global self*/

importScripts("downloadFeatures.js");

self.addEventListener("message", function (e) {
    console.log("Message recieved.", e);
    var url = e.data.url;
    if (e.data.operation === "download") {
        downloadFeatures(url).then(function (featureSet) {
            self.postMessage({ message: "download complete", features: featureSet });
            self.close();
        });
    }
});