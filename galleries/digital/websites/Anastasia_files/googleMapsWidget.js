/*
 *  The following widget(s) extend the WidgetMaster object defined in widgetParent.js
 */

/*
 *  Google Maps Widget
 *
 */

function gMapWidget(widgetId, widgetParams, articleContext) {
    WidgetMaster.call(this, widgetId, widgetParams, articleContext);
}

gMapWidget.prototype = Object.create(WidgetMaster.prototype);
gMapWidget.prototype.constructor = gMapWidget;

gMapWidget.prototype.render = function () {
    var defaults = {
      width:  700,
      height: Math.floor(700 / 1.618 - 100)  // dividing default width by golden ratio minus 100px
    };

    var widgetDiv = document.getElementById(this.widgetId);
    var wrapperContainer;

    if (widgetDiv) {

        wrapperContainer = this.renderWrapperContainer(widgetDiv); //wrapperContainer added for [AVT-4216]

        if (this.widgetParams["latitude"] != "" && this.widgetParams["longitude"] != "") {

            var make_mapLink = this.widgetParams["link"];

            var mapScale = "1";

            if (this.widgetParams["scale"] != "") {
                mapScale = this.widgetParams["scale"];
            }

            var mapImage_src = "https://maps.googleapis.com/maps/api/staticmap?markers=|";
            mapImage_src += this.widgetParams["latitude"];
            mapImage_src += ","
            mapImage_src += this.widgetParams["longitude"];
            mapImage_src += "&zoom=";
            mapImage_src += this.widgetParams["zoom"];
            mapImage_src += "&size=";
            mapImage_src += this.widgetParams["width"] || defaults.width;
            mapImage_src += "x";
            mapImage_src += this.widgetParams["height"] || defaults.height;
            mapImage_src += "&sensor=false"
            mapImage_src += "&scale="
            mapImage_src += mapScale;
            mapImage_src += "&center="
            mapImage_src += this.widgetParams["latitude"];
            mapImage_src += ","
            mapImage_src += this.widgetParams["longitude"];


            var mapLink_src = "http://maps.google.com/maps?q=";
            mapLink_src += this.widgetParams["latitude"];
            mapLink_src += ",";
            mapLink_src += this.widgetParams["longitude"];

            var mapImage = document.createElement("img");
            mapImage.setAttribute("src", mapImage_src);

            if (!this.widgetParams["width"]) {
              mapImage.setAttribute("style", "display: block; width: 100%; max-width: 100%;");
            }

            wrapperContainer.appendChild(mapImage);

            if (make_mapLink != "" && make_mapLink == "true") {
                var mapLink = document.createElement("a");
                mapLink.setAttribute("href", mapLink_src);
                mapLink.setAttribute("class", "get-directions btn btn-link");
                mapLink.setAttribute("target", "_blank");
                mapLink.innerHTML = this.widgetParams["get directions label"] || "get directions";

                wrapperContainer.appendChild(mapLink);
            }
        }
    }
};
