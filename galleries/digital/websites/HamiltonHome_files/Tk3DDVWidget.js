/*
 *  The following widget(s) extend the WidgetMaster object defined in widgetParent.js
 */

/*
 *  Tk3DDVWidget
 *
 *  Displays a Ticketing 3D Digital Venue map
 */

 function Tk3DDVWidget(widgetId, widgetParams, articleContext) {
    WidgetMaster.call(this, widgetId, widgetParams, articleContext);
}

Tk3DDVWidget.prototype = Object.create(WidgetMaster.prototype);
Tk3DDVWidget.prototype.constructor = Tk3DDVWidget;

Tk3DDVWidget.prototype.render = function () {

    var widgetDiv = document.getElementById(this.widgetId);

    if (widgetDiv) {
        var mapWrapper = this.renderWrapper(widgetDiv);
        var tk3ddvURL = this.widgetParams["tk3ddvURL"];
        
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = this.widgetParams["venueSiteScriptURL"];
        
        script.onload = function() {
          var config = {
            container: mapWrapper.id, // HTML element id that will contain the iframe
            url:       tk3ddvURL
          };

          // initialize the library
          var venuesite = new Venuesite(config);
          
          // open the iframe
          venuesite.load();
        };
        
        document.head.appendChild(script);
    }
};

Tk3DDVWidget.prototype.renderWrapper = function(parentElement) {
    // mapContainer controls the width and height of the venue map 
    // and includes any user-defined IDs or classes
    var mapContainer = document.createElement("div");
    
    mapContainer.id = "tk3DDV-container";

    if (this.widgetParams["mapHeight"]) {
        mapContainer.style.height = this.widgetParams["mapHeight"];
    }
    if (this.widgetParams["mapWidth"]) {
        mapContainer.style.width = this.widgetParams["mapWidth"];
    }
    if (this.widgetParams["css_id"]) {
        mapContainer.id = this.widgetParams["css_id"];
    }
    if (this.widgetParams["css_class"]) {
        mapContainer.className += " " + this.widgetParams["css_class"];
    }

    if (this.widgetParams["css_style"]) {
        mapContainer.setAttribute("style", this.widgetParams["css_style"]);
    }

    parentElement.appendChild(mapContainer);
    
    return mapContainer;
};
