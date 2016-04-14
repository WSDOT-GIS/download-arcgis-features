(function () {
    var form = document.forms.downloadForm;


    function createListItem(featureSet) {
        var list = document.getElementById("list");
        // TODO: Create data URI in worker, transferable objects.
        // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers#Passing_data_by_transferring_ownership_(transferable_objects)
        var s = JSON.stringify(featureSet);
        s = encodeURIComponent(s);
        var a = document.createElement("a");
        a.href = "data:," + s;
        a.textContent = "Feature Set";
        var li = document.createElement("li");
        li.appendChild(a);
        list.appendChild(li);
    }

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
                createListItem(features);
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