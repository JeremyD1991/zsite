/*
 *  The following widget(s) extend the WidgetMaster object defined in widgetParent.js
 */

/* 
 *  Google Plus One Widget
 *
 */

function gpPlus1Widget(widgetId, widgetParams, articleContext) {
    WidgetMaster.call(this, widgetId, widgetParams, articleContext);
}

gpPlus1Widget.prototype = Object.create(WidgetMaster.prototype);
gpPlus1Widget.prototype.constructor = gpPlus1Widget;

gpPlus1Widget.prototype.render = function () {

    var widgetDiv = document.getElementById(this.widgetId);
    if (widgetDiv && plusApi_loaded == true && "gapi" in window) {

        this.renderWrapperContainer(widgetDiv); //wrapperContainer added for [AVT-4216]

        var pageURL = window.location;
        var plusOne_href = this.widgetParams["href"];
        var plusOne_size = this.widgetParams["size"];
        var plusOne_annotations = this.widgetParams["annotation"];
        var plusOne_width = this.widgetParams["width"];
        var plusOne_align = this.widgetParams["align"];
        var plusOne_expandTo = this.widgetParams["expandTo"];
        var plusOne_recommendations = this.widgetParams["recommendations"];
                
        gapi.plusone.render(
            widgetDiv,
            {
                "href" : plusOne_href,
                "size" : plusOne_size,
                "annotation" : plusOne_annotations,
                "width" : plusOne_width,
                "align" : plusOne_align,
                "expandTo" : plusOne_expandTo,
                "recommendations": plusOne_recommendations
            }
        );
    }
};
