ArcGIS feature download
=======================

[![Build Status](https://travis-ci.org/WSDOT-GIS/download-arcgis-features.svg?branch=master)](https://travis-ci.org/WSDOT-GIS/download-arcgis-features)

<a name="module_downloadFeatures"></a>

## downloadFeatures ⇒ <code>[Promise.&lt;FeatureSet&gt;](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/FeatureSet_object/02r3000002mn000000/)</code>
Downloads a feature set from a feature layer.

**Returns**: <code>[Promise.&lt;FeatureSet&gt;](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/FeatureSet_object/02r3000002mn000000/)</code> - - Returns a feature set.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL to a feature layer. |

**Example**  
```js
downloadFeatures("http://data.example.com/arcgis/rest/services/Shared/CountyBoundaries/MapServer/0").then(function (featureSet) {
    console.debug("featureSet", featureSet);
}, function (error) {
    console.error(error);
});
```
