// JavaScript Document

function instagramFeedWidget(widgetId, widgetParams, articleContext) {
	WidgetMaster.call(this, widgetId, widgetParams, articleContext);
}

instagramFeedWidget.prototype = Object.create(WidgetMaster.prototype);
instagramFeedWidget.prototype.constructor = instagramFeedWidget;

instagramFeedWidget.prototype.render = function () {
	var widgetDiv = document.getElementById(this.widgetId);
	var tagName = "";
	
	if (widgetDiv) {
		this.renderWrapperContainer(widgetDiv);
		
		tagName = this.widgetParams["tag_name"];       
		var userID = this.widgetParams["userID"];
		var token = this.widgetParams["access_token"];
		var count = "";
		if(this.widgetParams["post_count"])
			count = this.widgetParams["post_count"];
		else
			count = 21; //By default display 21 pics. Chose 21 since divisible by 3 and all carousel slides are full

		if (token && (tagName || userID)) {
			var callbackScript = document.createElement("script");
			callbackScript.setAttribute("onload","$(\".instagram-holder .carousel\").carousel({interval: 5000,pause: \"hover\"})"); //Get the carousel moving

			if(userID != "")
				callbackScript.setAttribute("src", "https://api.instagram.com/v1/users/" + userID + "/media/recent/?access_token=" + token + "&callback=drawInstagramFeed&count=" + count);
			else if(tagName != "")
				callbackScript.setAttribute("src", "https://api.instagram.com/v1/tags/" + tagName + "/media/recent?access_token=" + token + "&callback=drawInstagramFeed&count=" + count);

			var feedParent = document.createElement("div");
			feedParent.setAttribute("class", "instagram-holder");
			feedParent.setAttribute("id", "instagram-holder");
			var feed = document.createElement("ul");
			feed.setAttribute("class", "instagram-scroller clearfix list-unstyled");
			feed.setAttribute("id", "instagram-block-scroller");

			this.wrapperContainer.appendChild(callbackScript);
			this.wrapperContainer.appendChild(feedParent);
			feedParent.appendChild(feed);
		}
	}
	
	window.getTagName = function foo() {
		return tagName;
	};
}

instagramFeedWidget.prototype.renderWrapperContainer = function (parentElement) {
	this.wrapperContainer = document.createElement("div");
	if (this.widgetParams["css_id"]) {
		this.wrapperContainer.id = this.widgetParams["css_id"];
	}
	if (this.widgetParams["css_class"]) {
		this.wrapperContainer.setAttribute("class", this.widgetParams["css_class"]);
	}
	if (this.widgetParams["css_style"]) {
		this.wrapperContainer.setAttribute("style", this.widgetParams["css_style"]);
	}
	parentElement.appendChild(this.wrapperContainer);
};

function drawInstagramFeed(obj) {

	var instagramJSON = JSON.stringify(obj);
	var instagramImages = JSON.parse(instagramJSON);

	var URLsmallImage;
	var URLlargeImage;
	var smallImage;
	var largeImage;
	var imageCaption;
	var tagName = getTagName();
	
	var divSlides = document.createElement("div");
	divSlides.setAttribute("class", "carousel-inner");
	
	var ol = document.createElement("ol");
	ol.setAttribute("class", "carousel-indicators");
	
	var ulCont = document.createElement("ul");
	ulCont.setAttribute("class", "list-inline");
	var entered = false;
	
	for (var i=0; i < instagramImages.data.length; i++) {
		
		if(tagName != "")
		{
			var showImage = false;
			for(var j = 0; j < instagramImages.data[i].tags.length; j++)
			{
				var tag = instagramImages.data[i].tags[j];
				if(tag == tagName)
					showImage = true;
			}
			
			if(!showImage)
				continue;
		}
		
		URLsmallImage = instagramImages.data[i].images.thumbnail.url; //used for the carousel 
		URLlargeImage = instagramImages.data[i].images.standard_resolution.url; //used for the hyperlink in the image to expand
		
		smallImage = "https://" + URLsmallImage.substr(URLsmallImage.indexOf('://')+3);
		largeImage = "https://" + URLlargeImage.substr(URLlargeImage.indexOf('://')+3);
		
		imageCaption = "";
		if(instagramImages.data[i].caption != null){
			imageCaption = instagramImages.data[i].caption.text;
		}
		
		var feedListItem = document.createElement("li");
		feedListItem.setAttribute("class","instagram-image");
		feedListItem.setAttribute("id","instagram-image" + i);
		
		var feedImageLink = document.createElement("a");
		feedImageLink.setAttribute("href",largeImage);
		feedImageLink.setAttribute("rel","prettyPhoto[pp_gal]");
		feedImageLink.setAttribute("title", imageCaption);
		feedListItem.appendChild(feedImageLink);
		
		var feedImageThumb = document.createElement("img");
		feedImageThumb.setAttribute("src", smallImage);
		feedImageThumb.setAttribute("alt", imageCaption);			
		feedImageLink.appendChild(feedImageThumb);

		ulCont.appendChild(feedListItem);
		
		if((i+1) % 3 == 0) //Only displaying 3 images per carousel slide
		{
			entered = true; //Flag to see if we created at least one slide
			var divItem = document.createElement("div");
			if(i == 2)
			{
				divItem.setAttribute("class", "item active");
				
				var li = document.createElement("li");
				li.setAttribute("class", "active");
				ol.appendChild(li);		
			}
			else
			{
				divItem.setAttribute("class", "item");
				
				var li = document.createElement("li");
				ol.appendChild(li);			
			}
			var cln = ulCont.cloneNode(true);
			divItem.appendChild(cln);
			divSlides.appendChild(divItem);
			ulCont.innerHTML = "";	
		}
	}
	
	if(!entered && ulCont.innerHTML != "")
	{
		var divItem = document.createElement("div");
		divItem.setAttribute("class", "item active");
		
		var li = document.createElement("li");
		li.setAttribute("class", "active");
		ol.appendChild(li);		
		
		var cln = ulCont.cloneNode(true);
		divItem.appendChild(cln);
		divSlides.appendChild(divItem);
		ulCont.innerHTML = "";	
	}
	
	drawPics(divSlides,ol);
}

function drawPics(divSlides,ol) {
	var car = document.createElement("div");
	car.setAttribute("class", "carousel slide");
	car.setAttribute("id", "carousel-example-generic");
	car.setAttribute("data-ride", "carousel");
	document.getElementById("instagram-holder").appendChild(car);	
	
	car.appendChild(ol);	
	car.appendChild(divSlides);
	
	var mycode = "  <a class=\"left carousel-control\" href=\"#carousel-example-generic\" role=\"button\" data-slide=\"prev\">\
					<span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></span>\
					<span class=\"sr-only\">Previous</span>\
				  </a>\
				  <a class=\"right carousel-control\" href=\"#carousel-example-generic\" role=\"button\" data-slide=\"next\">\
					<span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span>\
					<span class=\"sr-only\">Next</span>\
				  </a>";
				  
	car.innerHTML += mycode; 
}

