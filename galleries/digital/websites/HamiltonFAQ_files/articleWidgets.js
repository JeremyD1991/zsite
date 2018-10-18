
/*
  articleWidgets.js
  Description: Methods for web widgets that are called by Online for article content
  author: Michael Stadnik
*/

/*
 *
 * Widget HTML Format
 *
 * <div id="avWidget0articleTitle" class="{WidgetType}" style="display:none;">    //the class is the type of widget ex. videoClip, likeButton, etc.
 * <p id="{parameterName1}">{value1}</p>
 * <p id="{parameterName2}">{value2}</p>
 * </div>
 *
 * Widget Prep Functions
 *
 */

//list of functions
var widgetFunctions = {};

// Maps the widget's registry name to its JavaScript object name
var widgetMapping = {
    "SearchWebWidget"     : "TabularSearchResultsWidget",
    "SearchWebWidget2"    : "DetailedSearchResultsWidget",
    "SearchWebWidget3"    : "GridSearchResultsWidget",
    "SearchFilterWidget"  : "SearchFilterWidget",
    "CalendarWidget"      : "CalendarWidget",
    "LoginWebWidget"      : "LoginWidget",
    "VideoWebWidget"      : "VideoWidget",
    "3DDVWidget"          : "Tk3DDVWidget",
    "TWfollowWebWidget"   : "followWidget",
    "TWtweetWebWidget"    : "tweetWidget",
    "GPplus1WebWidget"    : "gpPlus1Widget",
    "GoogleMapsWebWidget" : "gMapWidget",
    "FBlikeWebWidget"     : "fbLikeWidget",
    "FBcommentsWebWidget" : "fbCommentsWidget",
    "FBeventWidget"       : "facebookEventWidget",
    "Instagram"           : "instagramFeedWidget"
};

// Widgets to be drawn
var widgetQueue = [];

// Register the widget to be drawn later, when the DOM is ready
function registerWidget(widgetName, widgetId, widgetParams) {

    widgetQueue.push({
        name : widgetName,
        id: widgetId,
        params : widgetParams
    });
}


// Draw all the widgets
function drawWidgets(articleContext) {

    for (var i = 0; i < widgetQueue.length; i++) {
        var widget = widgetQueue[i];
        drawWidget(widget.name, widget.id, widget.params, articleContext);
    }
    widgetQueue.length = 0;
}


// Draw the widget with the given arguments
function drawWidget(widgetName, widgetId, widgetParams, articleContext) {

    if (typeof widgetFunctions[widgetName] === 'function') {
        // TODO: convert widgets to use DOM methods
        var divElement = document.getElementById(widgetId);
        if (divElement) {
            divElement.innerHTML = widgetFunctions[widgetName](divElement, widgetParams, articleContext);
        }
    }
    else {
        var objectName = widgetMapping[widgetName];
        var widgetFunc = objectName && window[objectName];
        if (typeof widgetFunc === 'function') {
            var widget = new widgetFunc(widgetId, widgetParams, articleContext);
            widget.render();
        }
    }
}


var searchFieldMap = {};

// Create map of search field name to it's index in the array
function createSearchMapping(articleContext) {

    if (!articleContext || !articleContext.searchNames) {
        return;
    }

    var numFields = articleContext.searchNames.length;
    for (var j = 0; j < numFields; j++) {
        var name = articleContext.searchNames[j];
        searchFieldMap[name] = j;
    }
}

// Constructs a new SearchResult object from the given record array
function SearchResult(record) {

    this.record = record;

    // Returns the value of the field with the given name or empty if name not found
    this.get = function (name) {
        var index = searchFieldMap[name];
        if (index != null)
            return this.record[index];
        return '';
    };

    // Returns true if this item has a promo
    this.isPromo = function () {
        var calendarStatus = this.get("sales_status");
        return (calendarStatus == 'C*' || calendarStatus == 'S*' || calendarStatus == 'R*');
    };
}

// Inserts secure token into article forms, transformed form tags have names starting with BOset::WScontent::FormResponses::
function insertToken(articleContext) {

    if (articleContext) {
        var formsList = document.getElementsByName("avArticleForm");
        var contextId = articleContext.contextId;

        for (var i = 0, length = formsList.length; i < length; i++) {

	        var frm = formsList[i];
	        if (sTokenName && sToken) {
	            frm.appendChild(tsCreateHidden(sTokenName, sToken));
	        }

            if (contextId) {
                frm.appendChild(tsCreateHidden("context_id", contextId));
            }
        }
    }
}
