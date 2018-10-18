/*
 *  The following widget(s) extend the WidgetMaster object defined in widgetParent.js
 */

/* 
 *  Twitter Follow Widget
 *
 */

function followWidget(widgetId, widgetParams, articleContext) {
    WidgetMaster.call(this, widgetId, widgetParams, articleContext);
}

followWidget.prototype = Object.create(WidgetMaster.prototype);
followWidget.prototype.constructor = followWidget;

followWidget.prototype.render = function () {

    var widgetDiv = document.getElementById(this.widgetId);
    // check to see if twitter is enabled on the site
    if (widgetDiv && twitterApi_loaded == true && "twttr" in window) {

        var user = this.widgetParams["username"].replace("@", "");
        var showCount = this.widgetParams["data-show-count"];
        var language = this.widgetParams["data-lang"];
        var widget_width = this.widgetParams["data-width"];
        var widget_align = this.widgetParams["data-align"];
        var button_size = this.widgetParams["data-size"];
   
        if (user != "") {
            var follow_a = document.createElement("a");
            follow_a.setAttribute("href", "https://twitter.com/" + user);
            follow_a.setAttribute("class", "twitter-follow-button");
            follow_a.setAttribute("data-show-count", showCount);
            follow_a.setAttribute("data-lang", language);
            follow_a.setAttribute("data-width", widget_width);
            follow_a.setAttribute("data-align", widget_align);
            follow_a.setAttribute("data-size", button_size);
            follow_a.setAttribute("data-dnt", "true");


            widgetDiv.appendChild(follow_a);
            twttr.widgets.load(widgetDiv);
        }
    }
};


/*
 *  Twitter Re-tweet Widget
 */

function tweetWidget(widgetId, widgetParams, articleContext) {
    WidgetMaster.call(this, widgetId, widgetParams, articleContext);
}

tweetWidget.prototype = Object.create(WidgetMaster.prototype);
tweetWidget.prototype.constructor = tweetWidget;

tweetWidget.prototype.render = function () {

    var widgetDiv = document.getElementById(this.widgetId);
    // check to see if twitter is enabled on the site
    if (widgetDiv && twitterApi_loaded == true && "twttr" in window) {

        var url = this.widgetParams["url"];
        var text = this.widgetParams["text"];
        var related = this.widgetParams["related"];
        var count = this.widgetParams["count"];
        var lang = this.widgetParams["lang"];
        var count_url = this.widgetParams["counturl"];
        var hash_tag = this.widgetParams["hashtags"].replace("#", "");
        var data_size = this.widgetParams["size"];
        var data_dnt = this.widgetParams["dnt"];

        var retweet_a = document.createElement("a");
        retweet_a.setAttribute("href", "https://twitter.com/share");
        retweet_a.setAttribute("class", "twitter-share-button");

        retweet_a.setAttribute("data-url", url);
        retweet_a.setAttribute("data-text", text);
        retweet_a.setAttribute("data-related", related);

        retweet_a.setAttribute("data-count", count);
        retweet_a.setAttribute("data-lang", lang);
        retweet_a.setAttribute("data-counturl", count_url);
        retweet_a.setAttribute("data-hashtags", hash_tag);
        retweet_a.setAttribute("data-size", data_size);
        retweet_a.setAttribute("data-dnt", data_dnt);

        widgetDiv.appendChild(retweet_a);
        twttr.widgets.load(widgetDiv);
    }
};
