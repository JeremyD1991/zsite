//
// The following widget(s) extend the WidgetMaster object defined in widgetParent.js
//

// ---------- FACEBOOK EVENT ---------- //

function facebookEventWidget(widgetId, widgetParams, articleContext) {
    WidgetMaster.call(this, widgetId, widgetParams, articleContext);
}

facebookEventWidget.prototype = Object.create(WidgetMaster.prototype);
facebookEventWidget.prototype.constructor = facebookEventWidget;

facebookEventWidget.prototype.render = function () {

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
        var external_reference_code = this.widgetParams["external_reference_code"];
        var link_label = this.widgetParams["link-label"];
        var attending_label = this.widgetParams["attending_label"];
        
        if(external_reference_code != "")
        {
          var fbButton = document.createElement("a");
          fbButton.setAttribute("class", "btn button-link facebook");
          fbButton.setAttribute("href", "https://www.facebook.com/events/" + external_reference_code);
          fbButton.appendChild(document.createTextNode(link_label));
          fbButton.setAttribute("target", "_blank");

          widgetDiv.appendChild(fbButton);
          FB.XFBML.parse(widgetDiv);
          
          FB.getLoginStatus(function (response) {
            if (response.status == 'connected') { 
              if(external_reference_code != ""){
                this.getEventAttendees(response, external_reference_code,widgetDiv, attending_label);
              }
            }
            else {
              // the user is logged in to Facebook, 
              // but has not authenticated your app
              FB.login(function (response) {
                if (response.authResponse) {
                  if(external_reference_code != ""){
                    this.getEventAttendees(response, external_reference_code, attending_label);
                  }
                }
                else {
                  //User cancelled login or did not fully authorize		
                }
              }, {scope: 'rsvp_event,email,user_groups,publish_stream'} );
            }
          });
        }
    }
};

facebookEventWidget.prototype.getEventAttendees = function(response, eventCode, widgetDiv, attending_label)
{
	var thisUserID = response.authResponse.userID;
	FB.api('/' + eventCode + '/attending?fields=id,name,picture.type(square)&limit=6&access_token=' + encodeURIComponent(response.authResponse.accessToken),"get",function(response)
	{
	    var attendtingList = document.createElement("ul");
	    attendtingList.setAttribute("class", "inline unstyled");
		var attendingLength = response.data.length;

		var attendtingDiv = document.createElement("div");
		attendtingDiv.setAttribute("class", "attendingDiv")
		var totalAtt = 0;

		for(var i = 0; i < attendingLength; i++)
		{			
			var attendeeID = response.data[i].id;
			var attendeeName = response.data[i].name;
			var attendeePic = response.data[i].picture.data.url;
			if(attendeeID != thisUserID){
				totalAtt++;
				var attendeeLink = document.createElement("a");
				attendeeLink.setAttribute("href","https://www.facebook.com/" + attendeeID);
				attendeeLink.setAttribute("target","_blank");
				attendeeLink.setAttribute("title",attendeeName);

				var attendeeImage = document.createElement("img");
				attendeeImage.setAttribute("src", attendeePic);
				attendeeImage.setAttribute("alt", attendeeName);
				
				var attendeeSpan = document.createElement("span");
				attendeeSpan.setAttribute("class","attendeeSpan")
				attendeeSpan.innerHTML = attendingLength;
				if(i < 6)
				{
					var attendeeItem = document.createElement("li");
					attendeeLink.appendChild(attendeeImage);	
					attendeeItem.appendChild(attendeeLink);
					attendtingList.appendChild(attendeeItem);
				}
			} 
		}
		var attendeeText = document.createElement("span");
		attendeeText.innerHTML = attending_label;
		attendeeText.setAttribute("class","attendeeText");
		attendeeSpan.innerHTML = totalAtt;
		attendeeSpan.appendChild(attendeeText);
		attendtingDiv.appendChild(attendtingList);
		widgetDiv.appendChild(attendtingDiv);	
		widgetDiv.appendChild(attendeeSpan);
		widgetDiv.setAttribute("class","fbEventwidgetDiv")
	});
	return true;
}

