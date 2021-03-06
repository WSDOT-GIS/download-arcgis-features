ArcGIS feature download
=======================

[![Build Status](https://travis-ci.org/WSDOT-GIS/download-arcgis-features.svg?branch=master)](https://travis-ci.org/WSDOT-GIS/download-arcgis-features)
[![bitHound Overall Score](https://www.bithound.io/github/WSDOT-GIS/download-arcgis-features/badges/score.svg)](https://www.bithound.io/github/WSDOT-GIS/download-arcgis-features)
[![bitHound Dependencies](https://www.bithound.io/github/WSDOT-GIS/download-arcgis-features/badges/dependencies.svg)](https://www.bithound.io/github/WSDOT-GIS/download-arcgis-features/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/WSDOT-GIS/download-arcgis-features/badges/devDependencies.svg)](https://www.bithound.io/github/WSDOT-GIS/download-arcgis-features/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/WSDOT-GIS/download-arcgis-features/badges/code.svg)](https://www.bithound.io/github/WSDOT-GIS/download-arcgis-features)

How it works
------------

1. Query map service / feature service layer to get layer info, including the maximum number of features that can be returned.

        http://example.com/arcgis/rest/services/TransportationProjects/PlannedProjects/MapServer/0?f=json

2. Query for all object IDs. The object ID query is not bound by the maximum number of features as most queries are.

        http://example.com/arcgis/rest/services/TransportationProjects/PlannedProjects/MapServer/0/query?where=1%3D1&returnIdsOnly=true&f=json

3. The next step depends on if there are more records than can be returned per query.

    * If the number of OIDs is below the maximum number of features limit, use a query with a "1=1" where statement

            http://example.com/arcgis/rest/services/TransportationProjects/PlannedProjects/MapServer/0/query?where=1%3D1&outFields=*&f=json

    * Otherwise, divide the OIDs into chunks and make multiple queries using the SQL *IN* operator.

<a name="module_featureQueryUtils"></a>

## featureQueryUtils
Utilities for querying map service / feature service layers.

<a name="module_featureQueryUtils..downloadFeatures"></a>

### featureQueryUtils~downloadFeatures(url) ⇒ <code>[Promise.&lt;FeatureSet&gt;](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/FeatureSet_object/02r3000002mn000000/)</code>
Downloads a feature set from a feature layer.

**Kind**: inner method of <code>[featureQueryUtils](#module_featureQueryUtils)</code>  
**Returns**: <code>[Promise.&lt;FeatureSet&gt;](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/FeatureSet_object/02r3000002mn000000/)</code> - - Returns a feature set.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL to a feature layer. |

**Example**  
```js
var promise = featureQueryUtils.downloadFeatures("http://data.example.com/arcgis/rest/services/Shared/CountyBoundaries/MapServer/0");promise.then(function (featureSet) {    console.debug("featureSet", featureSet);}, function (error) {    console.error(error);});
```
