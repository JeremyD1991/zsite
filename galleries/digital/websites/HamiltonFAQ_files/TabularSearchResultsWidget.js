/*
 *  The following widget(s) extend the WidgetMaster object defined in widgetParent.js
 */

/* 
 *  Tabular Search Results Widget
 *
 *  Displays search results in a table with headings. 
 *  This is the original look of the performance search results.
 */
 
function TabularSearchResultsWidget(widgetId, widgetParams, articleContext) {
    WidgetMaster.call(this, widgetId, widgetParams, articleContext);
     
    this.container = null;
    this.form = null;
    this.resultsBox = null;

    this.showPrice = false;
    if (widgetParams) {
        this.showPrice = widgetParams.showPrice && widgetParams.showPrice.toLowerCase() == "true";
    }    
}

TabularSearchResultsWidget.prototype = Object.create(WidgetMaster.prototype);
TabularSearchResultsWidget.prototype.constructor = TabularSearchResultsWidget;

TabularSearchResultsWidget.prototype.render = function () {

    var widgetDiv = document.getElementById(this.widgetId);
    if (widgetDiv) {

        // Use document fragment to minimize page reflows, thereby improving performance.
        var fragment = document.createDocumentFragment();
        this.renderWidget(fragment);
        widgetDiv.appendChild(fragment);
    }
};

TabularSearchResultsWidget.prototype.renderWidget = function (fragment) {

    this.renderWrapperContainer(fragment); //wrapperContainer added for [AVT-4216]

    if (this.articleContext.searchResults) {

        this.renderContainer(this.wrapperContainer);
        this.renderHeading(this.container);
        this.renderForm(this.container);

        this.renderResultsBox(this.form);
        //this.renderTableHeading(this.resultsBox);
        this.renderSearchResults(this.resultsBox);
        this.renderPaging(this.form);
        this.renderLegend(this.wrapperContainer);
    }
    else {
        this.renderNoResults(this.wrapperContainer);
    }
};


TabularSearchResultsWidget.prototype.renderNoResults = function (parentElement) {

    var showNoResults = this.widgetParams.showNoResults;
    if (showNoResults && showNoResults.toLowerCase() == "true") {
        var message = this.articleContext.searchLabels && this.articleContext.searchLabels.no_results_message;
        if (message) {
            parentElement.appendChild(tsCreateParagraph(message, "attention"));
        }
    }
}


TabularSearchResultsWidget.prototype.renderContainer = function (parentElement) {

    this.container = tsCreateDiv("search-results-container");
    parentElement.appendChild(this.container);
};


TabularSearchResultsWidget.prototype.renderHeading = function (parentElement) {

    var title = this.widgetParams && this.widgetParams.title;
    if (title) {
        var heading = tsCreateHeading(title);
        heading.className = "search-results-heading";
        parentElement.appendChild(heading);
    }
};


TabularSearchResultsWidget.prototype.renderForm = function (parentElement) {

    this.form = tsCreateForm("seatSelect.asp");
    this.form.target = "_parent";
    parentElement.appendChild(this.form);
    this.form.appendChild(tsCreateHidden(sTokenName, sToken));
};


TabularSearchResultsWidget.prototype.renderResultsBox = function (parentElement) {

    this.resultsBox = tsCreateDiv("results-box standard-search-results");
    parentElement.appendChild(this.resultsBox);
};

TabularSearchResultsWidget.prototype.renderSearchResults = function (resultsBox) {

    var len = this.articleContext.searchResults && this.articleContext.searchResults.length;
    for (var i = 0; i < len; i++) {

        var searchResult = new SearchResult(this.articleContext.searchResults[i]);
        
        var rowcolor = (i % 2) ? 'even' : 'odd';

        // PROMO
        var promoClass = "";
        if (searchResult.isPromo()) {
            promoClass = " active-promo-event";
        }

        var row = resultsBox.appendChild(tsCreateDiv(rowcolor + " result-box-item" + promoClass));

        this.renderPerformance(row, searchResult);
    }
};


TabularSearchResultsWidget.prototype.renderPerformance = function (row, currentResult) {

    var title = currentResult.get("short_description") || currentResult.get("name");
    var startDate = currentResult.get("start_date");
    var startDateLabel = this.articleContext.searchHeaders[7];
    var endDate = currentResult.get("end_date");
    var endDateLabel = this.articleContext.searchHeaders[8];
    var infoLink = currentResult.get("additional_info");
    var objectType = currentResult.get("object_type");

    // DESCRIPTION
    var descriptionCell = row.appendChild(tsCreateDiv("item-description result-box-item-details"));
    
    descriptionListItem = descriptionCell.appendChild(tsCreateDiv("item-name"));
    if (infoLink) {
        var link = descriptionListItem.appendChild(tsCreateInfoLink(infoLink, title, "more-info"));
        link.target = "_parent";
    }
    else {
        descriptionListItem.appendChild(tsCreateText(title));
    }

    // DATE 
    if (startDate) {
        var startDateItem = descriptionCell.appendChild(tsCreateDiv("item-start-date"));
        if (!endDate) {
            startDateItem.appendChild(tsCreateSpan(startDateLabel, "start-date-label"));
            startDateItem.appendChild(tsCreateSpan(startDate, "start-date"));
        }
        else {
            var endDateItem = descriptionCell.appendChild(tsCreateDiv("item-end-date"));
            startDateItem.appendChild(tsCreateSpan(startDateLabel, "start-date-label"));
            startDateItem.appendChild(tsCreateSpan(startDate, "start-date"));
            endDateItem.appendChild(tsCreateSpan(endDateLabel, "end-date-label"));
            endDateItem.appendChild(tsCreateSpan(endDate, "end-date"));
        }
    }

    // PRICE
    if (this.showPrice && (objectType == "P" || objectType == "M")) {

        var priceItem;

        var minPrice = currentResult.get("min_price");
        var maxPrice = currentResult.get("max_price");

        if (minPrice && maxPrice && minPrice === maxPrice) {
        
            priceItem = descriptionCell.appendChild(tsCreateDiv("item-price-range"));
            priceItem.appendChild(tsCreateSpan(minPrice, "price"));
        
        } else if (minPrice) {

            priceItem = descriptionCell.appendChild(tsCreateDiv("item-price-range"));
            priceItem.appendChild(tsCreateSpan(minPrice, "min-price"));                        

            if (maxPrice) {            

                priceItem.appendChild(tsCreateSpan(" - "));
                priceItem.appendChild(tsCreateSpan(maxPrice, "max-price"));
            }
        }
    }

    var avail = this.getAvailability(currentResult);

    // BUY LINK
    var calendarStatus = currentResult.get("sales_status");
    var buyLinkClass = "item-link result-box-item-details last-column " + avail.indicator;
    if (avail.indicator == "excellent" && (calendarStatus == 'C' || calendarStatus == 'C*')) {
        buyLinkClass += "  next-on-sale";
    }
    var buyItem = row.appendChild(tsCreateDiv(buyLinkClass));

    // AVAILABILITY

    var showAvailability = (this.articleContext.searchSUMO.availability_access == "true");
    if (showAvailability && avail) {
        var availItem = buyItem.appendChild(tsCreateDiv("availability-icon"));
        if (avail.image) {
            availItem.appendChild(tsCreateImage("../../content/images/branding/" + avail.image, avail.imageAlt));
        }
    }

    if (objectType == "O" && infoLink) {
            var link = tsCreateInfoLink(infoLink, this.articleContext.searchLabels.view_article_message);
            link.target = "_parent";
            link.setAttribute("class", "view-article btn btn-primary");
            buyItem.appendChild(link);
    }else if (objectType != "O") {
        this.renderBuyLink(buyItem, currentResult, avail);
    }

    



};


TabularSearchResultsWidget.prototype.renderBuyLink = function (buyItem, currentResult, avail) {

    var objectId = currentResult.get("id");
    var objectType = currentResult.get("object_type");
    var calendarStatus = currentResult.get("sales_status");
    var options = currentResult.get("options");
    var nextOnSale = currentResult.get("on_sale_date");

    if (calendarStatus == 'C' || calendarStatus == 'C*') {

        // Show next on sale date
        buyItem.appendChild(tsCreateSpan(this.articleContext.searchLabels.on_sale_message));
        var onSaleDiv = buyItem.appendChild(tsCreateDiv("av_on_sale_date"));
        if (nextOnSale) {
            onSaleDiv.appendChild(tsCreateText(nextOnSale));
        }
        else {
            onSaleDiv.appendChild(tsCreateSpan(this.articleContext.searchLabels.to_be_determined_message));
        }
    }
    else if (avail && avail.indicator == "soldout") {
        buyItem.appendChild(tsCreateSpan(this.articleContext.searchLabels.sold_out_message, "unavailable-message"));
    }
    else if (avail && avail.indicator == "unavailable") {
        buyItem.appendChild(tsCreateSpan(this.articleContext.searchLabels.unavailable_message, "unavailable-message"));
    }
    else {

        // Show buy link - do not assign a href otherwise the href & submit will clash       
        var buyLink = buyItem.appendChild(tsCreateLink("", "", "btn btn-primary"));
        var buyLabel = "";

        var articleSalesType = "buy";
        if (this.articleContext.salesType == "U") {
            articleSalesType = "upsell";
        } else if (this.articleContext.salesType == "A") {
            articleSalesType = "addon";
        }

        if (objectType === "P") {
            var showMapSelect = !isSmallScreen() && (this.articleContext.searchSUMO.mapSelect_access == "true");
            var buyPage = (showMapSelect && containsValue(options, 2) ? "mapSelect.asp" : "seatSelect.asp");

            buyLabel = this.articleContext.searchLabels[articleSalesType + "_seats_message"];
            buyLink.onclick = buySeatsLink(objectId, null, this.form, buyPage);
        }
        else if (objectType === "B") {
            buyLabel = this.articleContext.searchLabels[articleSalesType + "_bundle_message"];
            buyLink.onclick = buyBundleLink(objectId, null, this.form);
        }
        else if (objectType === "M") {
            buyLabel = this.articleContext.searchLabels[articleSalesType + "_item_message"];
            buyLink.onclick = buyItemLink(objectId, null, this.form);
        }
        else if (objectType === "G") {
            buyLabel = this.articleContext.searchLabels[articleSalesType + "_gift_message"];
            buyLink.onclick = buyGiftLink(objectId, this.form);
        }
        else if (objectType === "S") {
            buyLabel = this.articleContext.searchLabels[articleSalesType + "_storedvalueitem_message"];
            buyLink.onclick = buyStoredValueItemLink(objectId, null, this.form);
        }
        else if (objectType === "A") {
            buyLabel = this.articleContext.searchLabels.view_article_message;
            buyLink.onclick = viewArticleLink(objectId, null, this.form);
        }

        buyLink.appendChild(tsCreateSpan(buyLabel));

    }
};


TabularSearchResultsWidget.prototype.getAvailability = function (currentResult) {

    var avail = {};
    var status = currentResult.get("availability_status");

    switch (status) {
        case "E":
            avail.indicator = "excellent";
            avail.image = "availability-excellent.png";
            avail.imageAlt = this.articleContext.searchLabels.avail_excellent;
            break;
        case "G":
            avail.indicator = "good";
            avail.image = "availability-good.png";
            avail.imageAlt = this.articleContext.searchLabels.avail_good;
            break;
        case "L":
            avail.indicator = "limited";
            avail.image = "availability-limited.png";
            avail.imageAlt = this.articleContext.searchLabels.avail_limited;
            break;
        case "U":
            avail.indicator = "unavailable";
            avail.image = "availability-unavailable.png";
            avail.imageAlt = this.articleContext.searchLabels.unavailable_message;
            break;
        case "S":
            avail.indicator = "soldout";
            avail.image = "availability-sold-out.png";
            avail.imageAlt = this.articleContext.searchLabels.avail_sold_out;
            break;
        default:
            avail.indicator = "unknown";
    }

    return avail;
};


TabularSearchResultsWidget.prototype.renderPaging = function (parentElement) {

    var pagination = this.articleContext.pagination;
    if (!pagination || !pagination.total_pages || pagination.total_pages <= 1) {
        return;
    }

    var currentPage = (location.href.indexOf("loadArticle.asp") > -1 ? "loadArticle.asp" : "default.asp");

    var totalPageNumber = parseInt(pagination.total_pages, 10);
    var currentPageNumber = parseInt(pagination.current_page, 10);

    var pagination = parentElement.appendChild(tsCreateDiv("pagination-box"));
    var ul = pagination.appendChild(tsCreateList("pagination"));

    // PREVIOUS PAGE
    
    if (currentPageNumber > 1) {
        var prevPageItem = ul.appendChild(tsCreateListItem());
        prevPageItem.setAttribute("id", "av-prev-link");
        // AVT-6616 - cannot request 'previous' page as the user may have loaded another article and so the cache no longer knows which page is previous
        // Instead, call getPage and explicitly specify the required page
        var prevUrl = currentPage + "?" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
        prevUrl += "&BOset::WScontent::SearchResultsInfo::current_page=" + (currentPageNumber - 1);
        prevUrl += "&doWork::WScontent::getPage=";
        prevUrl += "&BOparam::WScontent::getPage::article_id=" + encodeURIComponent(articleContext.articleId);

        var prevLink = prevPageItem.appendChild(tsCreateLink(prevUrl));
        prevLink.appendChild(tsCreateSpan(" ","glyphicon glyphicon-chevron-left"));
        prevLink.appendChild(tsCreateSpan(this.articleContext.searchLabels.previous, "sr-only"));
    }

    // Paging		
    var page_window = 1;  // additional spaces above/below the current page
    
    var lower_window = 1;
    var upper_window = 4;

    if (currentPageNumber + page_window >= totalPageNumber) {
        lower_window = totalPageNumber - 3;
        upper_window = totalPageNumber;
    }
    else if (currentPageNumber - page_window > 1) {
        lower_window = currentPageNumber - page_window;
        upper_window = currentPageNumber + page_window;
    }

    // PAGES
    
    //
    for (var x = 1; x <= totalPageNumber; x++) {
        var pagingItem = ul.appendChild(tsCreateListItem());
        pagingItem.setAttribute("class", "av-paging-links");
        // AVT-6616 - The user may have loaded another article and so the cache no longer knows which article is current
        // To resolve this, pass in the expected articleId so the server can reload it if required
        var pageUrl = currentPage + "?" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
        pageUrl += "&BOset::WScontent::SearchResultsInfo::current_page=" + x;
        pageUrl += "&doWork::WScontent::getPage=";
        pageUrl += "&BOparam::WScontent::getPage::article_id=" + encodeURIComponent(articleContext.articleId);

        if (x == currentPageNumber) {
            pagingItem.appendChild(tsCreateSpan(x, "current"));
            pagingItem.setAttribute("class", "av-paging-links active");
        }
        else if (x == 1 || x == totalPageNumber) {
            // always emit the beginning and end  
            var pageLink = pagingItem.appendChild(tsCreateLink(pageUrl));
            pageLink.appendChild(tsCreateSpan(x));
        }
        else {
            // in the middle
            if (x < currentPageNumber && x >= lower_window) {
                if (x == lower_window && x - 1 > 1) {
                    pagingItem.appendChild(tsCreateSpan("...", "ellipsis"));
                }
                var pageLink = pagingItem.appendChild(tsCreateLink(pageUrl));
                pageLink.appendChild(tsCreateSpan(x));
            }
            else if (x > currentPageNumber && x <= upper_window) {
                var pageLink = pagingItem.appendChild(tsCreateLink(pageUrl));
                pageLink.appendChild(tsCreateSpan(x));

                if (x == upper_window && x + 1 < totalPageNumber) {
                    pagingItem.appendChild(tsCreateSpan("...", "ellipsis"));
                }
            }
        }
    }

    // NEXT PAGE
    
    if (currentPageNumber < totalPageNumber) {
        var nextPageItem = ul.appendChild(tsCreateListItem());
        nextPageItem.setAttribute("id", "av-prev-link");
        // AVT-6616 - cannot request 'next' page as the user may have loaded another article and so the cache no longer knows which page is next
        // Instead, call getPage and explictly specify the required page
        var nextUrl = currentPage + "?" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
        nextUrl += "&BOset::WScontent::SearchResultsInfo::current_page=" + (currentPageNumber + 1);
        nextUrl += "&doWork::WScontent::getPage=";
        nextUrl += "&BOparam::WScontent::getPage::article_id=" + encodeURIComponent(articleContext.articleId);

        var nextLink = nextPageItem.appendChild(tsCreateLink(nextUrl));
        nextLink.appendChild(tsCreateSpan(" ", "glyphicon glyphicon-chevron-right"));
        nextLink.appendChild(tsCreateSpan(this.articleContext.searchLabels.next, "sr-only"));
        
    }
};

TabularSearchResultsWidget.prototype.renderLegend = function (parentElement) {

    var labels = this.articleContext.searchLabels;
    if (!labels) {
        return;
    }

    if (!this.widgetParams.showLegend || this.widgetParams.showLegend.toLowerCase() != "true") {
        return
    }

    var div = tsCreateDiv("availability-legend result-box");
    parentElement.appendChild(div);

    var legendDiv = tsCreateDiv("result-box-item");
    div.appendChild(legendDiv);

    var heading = document.createElement("h4");
    heading.className = "availability-heading";
    heading.appendChild(tsCreateText(labels.availability_title));
    legendDiv.appendChild(heading)


    var addAvailabilityIcon = function (title, imgSrc, imgTitle, imgClass, listClass) {

        var iconDiv = legendDiv.appendChild(tsCreateDiv("result-box-item-details"));
        var span = tsCreateSpan("", "availability-icon");
        var imgTitle = imgTitle || title;
        span.appendChild(tsCreateImage(imgSrc, imgTitle, imgClass));
        iconDiv.appendChild(span);
        iconDiv.appendChild(tsCreateSpan(title, "availability-icon-label"));
    };

    var brandPath = labels.brand_path;
    addAvailabilityIcon(labels.avail_excellent, tsBuildLink(brandPath, "availability-excellent.png"));
    addAvailabilityIcon(labels.avail_good, tsBuildLink(brandPath, "availability-good.png"));
    addAvailabilityIcon(labels.avail_limited, tsBuildLink(brandPath, "availability-limited.png"));
    addAvailabilityIcon(labels.avail_sold_out, tsBuildLink(brandPath, "availability-sold-out.png"));
    addAvailabilityIcon(labels.unavailable_message, tsBuildLink(brandPath, "availability-unavailable.png"));

    if (labels.has_promo_code === "true") {
        addAvailabilityIcon(labels.active_promo_codes, "Images/star.png", labels.promo_code_item_title, "promoStar", "active-code-legend");
    }
};

/*
 *  Grid Search Results Widget 
 *
 *  Displays search results in a grid.
 */
 
function GridSearchResultsWidget(widgetId, widgetParams, articleContext) {
    TabularSearchResultsWidget.call(this, widgetId, widgetParams, articleContext);
}

GridSearchResultsWidget.prototype = Object.create(TabularSearchResultsWidget.prototype)
GridSearchResultsWidget.prototype.constructor = GridSearchResultsWidget;


GridSearchResultsWidget.prototype.renderWidget = function (fragment) {

    this.renderWrapperContainer(fragment); //wrapperContainer added for [AVT-4216]

    if (this.articleContext.searchResults) {

        this.renderContainer(this.wrapperContainer);
        this.renderHeading(this.container);
        this.renderForm(this.container);

        this.renderSearchResults(this.form);
        this.renderPaging(this.form);
        this.renderLegend(this.wrapperContainer);
    }
    else {
        this.renderNoResults(this.wrapperContainer);
    }
};


GridSearchResultsWidget.prototype.renderSearchResults = function (parentElement) {

    var len = this.articleContext.searchResults && this.articleContext.searchResults.length;
    var row = parentElement.appendChild(tsCreateDiv("grid-search-results"));
    for (var i = 0; i < len; i++) {

        var boxcolor = (i % 2) ? ' even' : ' odd';
        var boxEndSm = (i % 2) ? '' : ' row-first-result-sm';
        var boxEndLg = (i % 4) ? '' : ' row-first-result-lg';
        var boxEndMd = (i % 3) ? '' : ' row-first-result-md';
        var searchResult = new SearchResult(this.articleContext.searchResults[i]);

        var promoClass = "";
        if (searchResult.isPromo()) {
            promoClass = " active-promo-event";
        }

        var div = row.appendChild(tsCreateDiv("grid-result " + boxcolor + boxEndSm + boxEndMd + boxEndLg + promoClass));
       
        this.renderPerformance(div, searchResult);
    }
};


GridSearchResultsWidget.prototype.renderPerformance = function (div, currentResult)
{

    var title = currentResult.get("short_description") || currentResult.get("name");
    var infoLink = currentResult.get("additional_info");
    var objectType = currentResult.get("object_type");
    var logo1 = currentResult.get("image1");

    // LOGO
    var eventImageURL;
    var noEventImageClass = " no-logo";
    if (logo1)
    {
        eventImageURL = logo1;
        noEventImageClass = "";
    }

    var logoItem = div.appendChild(tsCreateDiv("item-image" + noEventImageClass));
    var logoSpan = logoItem.appendChild(tsCreateSpan("", "item-logo"));
    if (infoLink && logo1) {
        var link = logoSpan.appendChild(tsCreateInfoLink(infoLink));
        link.target = "_parent";
        link.appendChild(tsCreateImage(eventImageURL, title));
    }
    else if (logo1) {
        logoSpan.appendChild(tsCreateImage(eventImageURL, title));
    }

    // INFO LIST

    var descriptionCell = div.appendChild(tsCreateDiv("item-description"));

    this.renderPerformanceInfoList(descriptionCell, currentResult);

    // AVAILABILITY
    var avail = this.getAvailability(currentResult);
    var showAvailability = (this.articleContext.searchSUMO.availability_access == "true");
    if (showAvailability && avail)
    {
        var availitem = descriptionCell.appendChild(tsCreateDiv("availability-icon"));
        if (avail.image)
        {
            availitem.appendChild(tsCreateImage("../../content/images/branding/" + avail.image, avail.imageAlt));
        }
    }

    // BUY LINK

    var buyItem = div.appendChild(tsCreateDiv("item-link"));

    if (objectType == "O" && infoLink)
    {
        var link = tsCreateInfoLink(infoLink, this.articleContext.searchLabels.view_article_message);
        link.target = "_parent";
        link.setAttribute("class", "view-article btn btn-primary");
        buyItem.appendChild(link);
    } else if (objectType != "O")
    {
        this.renderBuyLink(buyItem, currentResult, avail);
    }

};

GridSearchResultsWidget.prototype.renderPerformanceInfoList = function (row, currentResult) {

    var title = currentResult.get("short_description") || currentResult.get("name");
    var desc = currentResult.get("description");
    var startDate = currentResult.get("start_date");
    var startDateLabel = this.articleContext.searchHeaders[7];
    var endDate = currentResult.get("end_date");
    var endDateLabel = this.articleContext.searchHeaders[8];
    var infoLink = currentResult.get("additional_info");
    var city = currentResult.get("city");
    var venueDesc = currentResult.get("venue_short_description") || currentResult.get("venue_description") || currentResult.get("venue_name"); 
    var objectType = currentResult.get("object_type");

    // DESCRIPTION
    var descItem = row.appendChild(tsCreateDiv("item-name"));
    if (infoLink) {
        var link = descItem.appendChild(tsCreateInfoLink(infoLink, title, "more-info"));
        link.target = "_parent"; 
   }
    else {
        descItem.appendChild(tsCreateText(title));
    }

    // DATE
    if (startDate) {
        var startDateItem = row.appendChild(tsCreateDiv("item-start-date"));
        var endDateItem = row.appendChild(tsCreateDiv("item-end-date"));
        if (!endDate) {
            startDateItem.appendChild(tsCreateSpan(startDateLabel, "start-date-label"));
            startDateItem.appendChild(tsCreateSpan(startDate, "start-date"));
        }
        else {
            startDateItem.appendChild(tsCreateSpan(startDateLabel, "start-date-label"));
            startDateItem.appendChild(tsCreateSpan(startDate, "start-date"));
            endDateItem.appendChild(tsCreateSpan(endDateLabel, "end-date-label"));
            endDateItem.appendChild(tsCreateSpan(endDate, "end-date"));
        }
    }

    // VENUE CITY, VENUE DESCRIPTION
    if (venueDesc || city) {
        var venueItem = row.appendChild(tsCreateDiv("item-venue"));
        if (city) {
            if (venueDesc) {
                venueDesc += ", ";
            }
            venueDesc += city;
        }
        venueItem.appendChild(tsCreateText(venueDesc));
    }

    // PRICE
    if (this.showPrice && (objectType == "P" || objectType == "M")) {

        var priceItem;

        var minPrice = currentResult.get("min_price");
        var maxPrice = currentResult.get("max_price");

        if (minPrice && maxPrice && minPrice === maxPrice) {
            
            priceItem = row.appendChild(tsCreateDiv("item-price-range"));
            priceItem.appendChild(tsCreateSpan(minPrice, "price"));
            
        } else if (minPrice) {

            priceItem = row.appendChild(tsCreateDiv("item-price-range"));
            priceItem.appendChild(tsCreateSpan(minPrice, "min-price"));                        

            if (maxPrice) {            

                priceItem.appendChild(tsCreateSpan(" - "));
                priceItem.appendChild(tsCreateSpan(maxPrice, "max-price"));
            }
        }
    }

    // DESCRIPTION
    if (desc) {
        var shortDescItem = row.appendChild(tsCreateDiv("item-teaser"));
        shortDescItem.innerHTML = desc;
    }
};

/*
 *	Detailed Search Results Widget
 *
 *  Displays the search results in rows with no table headings. 
 *  More details than the TabularSearchResultsWidget is displayed, including: performance logo, description, 
 *  short description, start and end dates, venue city, venue description, availability, and buy link.
 */
 
function DetailedSearchResultsWidget(widgetId, widgetParams, articleContext) {
    TabularSearchResultsWidget.call(this, widgetId, widgetParams, articleContext);
}

DetailedSearchResultsWidget.prototype = Object.create(TabularSearchResultsWidget.prototype);
DetailedSearchResultsWidget.prototype.constructor = DetailedSearchResultsWidget;


DetailedSearchResultsWidget.prototype.renderWidget = function (fragment) {

    this.renderWrapperContainer(fragment); //wrapperContainer added for [AVT-4216]

    if (this.articleContext.searchResults) {

        this.renderContainer(this.wrapperContainer);
        this.renderHeading(this.container);
        this.renderForm(this.container);

        this.renderParent(this.form);
        this.renderSearchResults(this.parentDiv);
        this.renderPaging(this.form);
        this.renderLegend(this.wrapperContainer);
    }
    else {
        this.renderNoResults(this.wrapperContainer);
    }
};


DetailedSearchResultsWidget.prototype.renderParent = function (parentElement) {
    this.parentDiv = tsCreateDiv("detailed-search-results results-box");
    parentElement.appendChild(this.parentDiv);
};


DetailedSearchResultsWidget.prototype.renderSearchResults = function (parentDiv) {
    


    var len = this.articleContext.searchResults && this.articleContext.searchResults.length;
    for (var i = 0; i < len; i++) {

        var rowcolor = (i % 2) ? 'even' : 'odd';

        var searchResult = new SearchResult(this.articleContext.searchResults[i]);

        var promoClass = "";
        if (searchResult.isPromo()) {
            promoClass = " active-promo-event";
        }
        var row = parentDiv.appendChild(tsCreateDiv(rowcolor + " result-box-item" + promoClass));
        this.renderPerformance(row, searchResult);
    }
};


DetailedSearchResultsWidget.prototype.renderPerformance = function (row, currentResult) {

    var title = currentResult.get("short_description") || currentResult.get("name");
    var infoLink = currentResult.get("additional_info");
    var objectType = currentResult.get("object_type");
    var logo1 = currentResult.get("image1");

    // LOGO
    var eventImageURL;
    var noEventImageClass = " no-logo";
    if (logo1)
    {
        eventImageURL = logo1;
        noEventImageClass = "";
    }
    var logoItem = row.appendChild(tsCreateDiv("item-image result-box-item-details" + noEventImageClass));
    var logoSpan = logoItem.appendChild(tsCreateSpan("", "item-logo"));
    if (infoLink && logo1) {
        var link = logoSpan.appendChild(tsCreateInfoLink(infoLink));
        link.target = "_parent";
        link.appendChild(tsCreateImage(eventImageURL, title));
    }
    else if (logo1) {
        logoSpan.appendChild(tsCreateImage(eventImageURL, title));
    }

    // INFO LIST
    this.renderPerformanceInfoList(row, currentResult);

    // AVAILABILITY
    var avail = this.getAvailability(currentResult);

    // BUY LINK
    var buyItem = row.appendChild(tsCreateDiv("item-link result-box-item-details last-column last-column " + avail.indicator));

    var showAvailability = (this.articleContext.searchSUMO.availability_access == "true");
    if (showAvailability && avail) {
        var availItem = buyItem.appendChild(tsCreateDiv("availability-icon"));
        if (avail.image) {
            availItem.appendChild(tsCreateImage("../../content/images/branding/" + avail.image, avail.imageAlt));
        }
    }

    if (objectType == "O" && infoLink) {
        var link = tsCreateInfoLink(infoLink, this.articleContext.searchLabels.view_article_message);
        link.target = "_parent";
        link.setAttribute("class", "view-article btn btn-primary");
        buyItem.appendChild(link);
    } else if (objectType != "O") {
        this.renderBuyLink(buyItem, currentResult, avail);
    }
};

DetailedSearchResultsWidget.prototype.renderPerformanceInfoList = function (row, currentResult) {

    var title = currentResult.get("short_description") || currentResult.get("name");
    var desc = currentResult.get("description");
    var startDate = currentResult.get("start_date");
    var startDateLabel = this.articleContext.searchHeaders[7];
    var endDate = currentResult.get("end_date");
    var endDateLabel = this.articleContext.searchHeaders[8];
    var infoLink = currentResult.get("additional_info");
    var city = currentResult.get("city");
    var venueDesc = currentResult.get("venue_short_description") || currentResult.get("venue_description") || currentResult.get("venue_name"); 
    var objectType = currentResult.get("object_type");

    var infoCell = row.appendChild(tsCreateDiv("item-description result-box-item-details"));

    // DESCRIPTION
    var descItem = infoCell.appendChild(tsCreateDiv("item-name"));
    if (infoLink) {
        var link = descItem.appendChild(tsCreateInfoLink(infoLink, title, "more-info"));
        link.target = "_parent";
    }
    else {
        descItem.appendChild(tsCreateText(title));
    }

    // DATE
    if (startDate) {
        var startDateItem = infoCell.appendChild(tsCreateDiv("item-start-date"));
        var endDateItem = infoCell.appendChild(tsCreateDiv("item-end-date"));
        if (!endDate) {
            startDateItem.appendChild(tsCreateSpan(startDateLabel, "start-date-label"));
            startDateItem.appendChild(tsCreateSpan(startDate, "start-date"));
        }
        else {
            startDateItem.appendChild(tsCreateSpan(startDateLabel, "start-date-label"));
            startDateItem.appendChild(tsCreateSpan(startDate, "start-date"));
            endDateItem.appendChild(tsCreateSpan(endDateLabel, "end-date-label"));
            endDateItem.appendChild(tsCreateSpan(endDate, "end-date"));
        }
    }

    // VENUE CITY, VENUE DESCRIPTION
    if (venueDesc || city) {
        var venueItem = infoCell.appendChild(tsCreateDiv("item-venue"));
        if (city) {
            if (venueDesc) {
                venueDesc += ", ";
            }
            venueDesc += city;
        }
        venueItem.appendChild(tsCreateText(venueDesc));
    }

    // PRICE
    if (this.showPrice && (objectType == "P" || objectType == "M")) {

        var priceItem;

        var minPrice = currentResult.get("min_price");
        var maxPrice = currentResult.get("max_price");


        if (minPrice && maxPrice && minPrice === maxPrice) {
            
            priceItem = infoCell.appendChild(tsCreateDiv("item-price-range"));
            priceItem.appendChild(tsCreateSpan(minPrice, "price"));
            
        } else if (minPrice) {

            priceItem = infoCell.appendChild(tsCreateDiv("item-price-range"));
            priceItem.appendChild(tsCreateSpan(minPrice, "min-price"));                        

            if (maxPrice) {            

                priceItem.appendChild(tsCreateSpan(" - "));
                priceItem.appendChild(tsCreateSpan(maxPrice, "max-price"));
            }
        }
    }

    // DESCRIPTION

    if (desc) {
        var shortDescItem = infoCell.appendChild(tsCreateDiv("item-teaser"));
        shortDescItem.innerHTML = desc;
    }
};
