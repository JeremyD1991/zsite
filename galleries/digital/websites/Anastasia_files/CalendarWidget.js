/*
 *  The following widget(s) extend the WidgetMaster object defined in widgetParent.js
 */

/*
 *  Calendar Widget
 *
 */

function CalendarWidget(widgetId, widgetParams, articleContext) {
    WidgetMaster.call(this, widgetId, widgetParams, articleContext);
}

CalendarWidget.prototype = Object.create(WidgetMaster.prototype);
CalendarWidget.prototype.constructor = CalendarWidget;

CalendarWidget.prototype.render = function () {

    var widgetDiv = document.getElementById(this.widgetId);
    if (widgetDiv) {

        this.renderWrapperContainer(widgetDiv); //wrapperContainer added for [AVT-4216]

        var monthToShow = this.widgetParams["displayMonth"];
        var defaultPerformanceDaysMonth = "";

        if (this.articleContext.searchFilters) {
            if (this.articleContext.searchFilters[1].name == "month_filter") {
                if (this.articleContext.searchFilters[1].values.length > 0) {
                    defaultPerformanceDaysMonth = this.articleContext.searchFilters[1].values[0][0];
                }
            }
            if  (defaultPerformanceDaysMonth == "") {
                if (monthToShow) 
                    defaultPerformanceDaysMonth = monthToShow;
            }
        } else {
            if (monthToShow) {
                defaultPerformanceDaysMonth = monthToShow; 
            }
            }

        var url = "calendarWidget.asp?";
        url += "BOparam::WScontent::searchPerformanceDays::month=" + encodeURIComponent(defaultPerformanceDaysMonth);

        if (this.widgetParams["seriesName"]) {
            url += "&BOparam::WScontent::searchPerformanceDays::series=" + encodeURIComponent(this.widgetParams["seriesName"]);
        }

        url += "&doWork::WScontent::searchPerformanceDays=1";

        var iframe = document.createElement("iframe");
        iframe.id = "calendar-widget-frame";
        iframe.name = "calendar-widget-frame";
        iframe.src = url;
        iframe.frameBorder = 0;
        iframe.setAttribute("allowtransparency", "true");

        this.wrapperContainer.appendChild(iframe);
    }
};
