//
// The following widget(s) extend the WidgetMaster object defined in widgetParent.js
//

// ---------- FACEBOOK LIKE BUTTON ---------- //

function fbLikeWidget(widgetId, widgetParams, articleContext) {
    WidgetMaster.call(this, widgetId, widgetParams, articleContext);
}

fbLikeWidget.prototype = Object.create(WidgetMaster.prototype);
fbLikeWidget.prototype.constructor = fbLikeWidget;

fbLikeWidget.prototype.render = function () {

    var widgetDiv = document.getElementById(this.widgetId);
    //check to see if facebook api is included in the page
    if (widgetDiv && fbApi_loaded == true && "FB" in window) {

        var pageURL = window.location;
        if (this.widgetParams["url"] != "") {
            pageURL = this.widgetParams["url"];
        }

        var button_layout = this.widgetParams["data-layout"];
        var button_width = this.widgetParams["data-width"];
        var button_faces = this.widgetParams["data-show-faces"];
        var button_action = this.widgetParams["data-action"];
        var button_colorscheme = this.widgetParams["data-colorscheme"];
        var button_font = this.widgetParams["data-font"];

        var fbButton = document.createElement("div");
        fbButton.setAttribute("class", "fb-like");
        fbButton.setAttribute("data-href", pageURL);
        fbButton.setAttribute("data-send", "true");
        fbButton.setAttribute("data-layout", button_layout);
        fbButton.setAttribute("data-width", button_width);
        fbButton.setAttribute("data-show-faces", button_faces);
        fbButton.setAttribute("data-action", button_action);
        fbButton.setAttribute("data-colorscheme", button_colorscheme);
        fbButton.setAttribute("data-font", button_font);

        widgetDiv.appendChild(fbButton);
        FB.XFBML.parse(widgetDiv);
    }
};


// ---------- FACEBOOK COMMENTS WIDGET ---------- //

function fbCommentsWidget(widgetId, widgetParams, articleContext) {
    WidgetMaster.call(this, widgetId, widgetParams, articleContext);
}

fbCommentsWidget.prototype = Object.create(WidgetMaster.prototype);
fbCommentsWidget.prototype.constructor = fbCommentsWidget;

fbCommentsWidget.prototype.render = function () {

    var widgetDiv = document.getElementById(this.widgetId);
    //check to see if facebook api is included in the page
    if (widgetDiv && fbApi_loaded == true && "FB" in window) {

        var pageURL = window.location;
        if (this.widgetParams["url"] != "") {
            pageURL = this.widgetParams["url"];
        }

        var comments_width = this.widgetParams["data-width"];
        var comments_colorscheme = this.widgetParams["data-colorscheme"];
        var comments_posts = this.widgetParams["data-num-posts"];

        var fbComments = document.createElement("div");
        fbComments.setAttribute("class", "fb-comments");
        fbComments.setAttribute("data-href", pageURL);
        fbComments.setAttribute("data-width", comments_width);
        fbComments.setAttribute("data-colorscheme", comments_colorscheme);
        fbComments.setAttribute("data-num-posts", comments_posts);

        widgetDiv.appendChild(fbComments);
        FB.XFBML.parse(widgetDiv);
    }
};


// ---------- FACEBOOK FACEPILE WIDGET ---------- //

function fbFacepileWidget(widgetId, widgetParams, articleContext) {
    WidgetMaster.call(this, widgetId, widgetParams, articleContext);
}

fbFacepileWidget.prototype = Object.create(WidgetMaster.prototype);
fbFacepileWidget.prototype.constructor = fbFacepileWidget;

fbFacepileWidget.prototype.render = function () {

    var widgetDiv = document.getElementById(this.widgetId);
    var comment = document.createComment(" FBFacepileWidget is deprecated from V2.0");
    widgetDiv.appendChild(comment);
};


// ---------- FACEBOOK ACTIVITY FEED WIDGET ---------- //

function fbActivityWidget(widgetId, widgetParams, articleContext) {
    WidgetMaster.call(this, widgetId, widgetParams, articleContext);
}

fbActivityWidget.prototype = Object.create(WidgetMaster.prototype);
fbActivityWidget.prototype.constructor = fbActivityWidget;

fbActivityWidget.prototype.render = function () {

  var widgetDiv = document.getElementById(this.widgetId);
  var comment = document.createComment(" FB Activity Feed is deprecated from V2.3");
  widgetDiv.appendChild(comment);
};


// ---------- FACEBOOK LIKE BOX (DEPRECATED) ---------- //

function fbLikeBoxWidget(widgetId, widgetParams, articleContext) {
    WidgetMaster.call(this, widgetId, widgetParams, articleContext);
}

fbLikeBoxWidget.prototype = Object.create(WidgetMaster.prototype);
fbLikeBoxWidget.prototype.constructor = fbLikeBoxWidget;

fbLikeBoxWidget.prototype.render = function () {

    var widgetDiv = document.getElementById(this.widgetId);
    var comment = document.createComment(" FBlikeBoxWebWidget is deprecated ");
    widgetDiv.appendChild(comment);
};
