/*global self*/

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
	for (i = 0, l = oids.length; i < l; i += maxRecordCount) {
		currentIds = oids.slice(i, maxRecordCount);
		where = [oidFieldName, " IN (", currentIds.join(","), ")"].join("");
		promise = queryFeatures(url, {
			where: where,
			outFields: "*"
		});
		promises.push(promise);
	}

	promise = Promise.all(promises);
	return promise;
}

self.addEventListener("message", function (e) {
	console.log("Message recieved.", e);
	var url = e.data.url;
	if (e.data.operation === "download") {
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
				self.postMessage({ message: "download complete", features: mainFS });
				self.close();
			});
		});
	}
});