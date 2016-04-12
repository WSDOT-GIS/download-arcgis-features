(function () {
	var form = document.forms.downloadForm;



	form.onsubmit = function () {
		var url = form.url.value;

		var worker = new Worker("worker.js");
		var progress = document.createElement("progress");

		worker.onmessage = function (e) {
			var features;
			if (e.data.message === "download complete") {
				features = e.data.features;
				progress.parentElement.removeChild(progress);
				console.log("download completed", features);
			} else {
				console.log("message recieved", e);
			}
		};

		document.body.appendChild(progress);

		worker.postMessage({
			operation: "download",
			url: url
		});

		return false;
	};
}());