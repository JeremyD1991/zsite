/*
 *  The following widget(s) extend the WidgetMaster object defined in widgetParent.js
 */

/*
 *  VideoWidget
 *
 *  Displays an embedded video.
 */

 function VideoWidget(widgetId, widgetParams, articleContext) {
    WidgetMaster.call(this, widgetId, widgetParams, articleContext);
}

VideoWidget.prototype = Object.create(WidgetMaster.prototype);
VideoWidget.prototype.constructor = VideoWidget;

VideoWidget.prototype.render = function () {

    var widgetDiv = document.getElementById(this.widgetId);

    if (widgetDiv) {
        var videoWrapper = this.renderVideoWrapper(widgetDiv);

        var hideControls = "&autohide=2";
        var autoplay = "&autoplay=0";
    
        if(this.widgetParams["hideControls"].toLowerCase() == "true"){
            hideControls = "&autohide=1";
            videoWrapper.className += " hide-controls";
        }else if (this.widgetParams["hideControls"].toLowerCase() == "false"){
            hideControls = "&autohide=0";       
        }
        if(this.widgetParams["autoPlay"].toLowerCase() == "true"){
            autoplay = "&autoplay=1";
        }
        var videoLink = "";

        if( this.widgetParams["link"] != "" )  {
            var singleVideoLink = this.widgetParams["link"].replace(/https?:\/\/youtu.be\//,"");
                            hideControls = hideControls.replace("&", "?");
                            videoLink = "https://www.youtube.com/embed/" + singleVideoLink + hideControls + autoplay;
        }

        var iframe = document.createElement("iframe");
        iframe.src = videoLink;
        iframe.frameBorder = 0;
        iframe.className = "video-widget";

        if (this.widgetParams["videoHeight"]) {
            // if the videoHeight parameter is a percent, don't assign it
            // instead, the iframe will take up the percent height of its container
            if (/%$/.test(this.widgetParams["videoHeight"]) == false) {
                iframe.style.height = this.widgetParams["videoHeight"];
            }
        }

        videoWrapper.appendChild(iframe);
    }
};

VideoWidget.prototype.renderVideoWrapper = function(parentElement) {
    // videoContainer controls the width and height of the video 
    // and includes any user-defined IDs or classes
    var videoContainer = document.createElement("div");
        videoContainer.className = "video-widget-container";

    if (this.widgetParams["videoHeight"]) {
        videoContainer.style.height = this.widgetParams["videoHeight"];
    }
    if (this.widgetParams["videoWidth"]) {
        videoContainer.style.width = this.widgetParams["videoWidth"];
    }
    if (this.widgetParams["css_id"]) {
        videoContainer.id = this.widgetParams["css_id"];
    }
    if (this.widgetParams["css_class"]) {
        videoContainer.className += " " + this.widgetParams["css_class"];
    }

    // videoWrapper ensures that the correct video aspect ratio is preserved
    // and includes any user-defined styles
    this.videoWrapper = document.createElement("div");
    this.videoWrapper.className = "video-widget-wrapper";

    if (this.widgetParams["css_style"]) {
        this.videoWrapper.setAttribute("style", this.widgetParams["css_style"]);
    }

    videoContainer.appendChild(this.videoWrapper);
    parentElement.appendChild(videoContainer);
    
    return this.videoWrapper;
};
