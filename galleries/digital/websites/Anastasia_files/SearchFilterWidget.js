/*
 *  The following widget(s) extend the WidgetMaster object defined in widgetParent.js
 */

/* 
 *  Search Filter Widget
 *
 */
 
function SearchFilterWidget(widgetId, widgetParams, articleContext) {
    WidgetMaster.call(this, widgetId, widgetParams, articleContext);
}

SearchFilterWidget.prototype = Object.create(WidgetMaster.prototype);
SearchFilterWidget.prototype.constructor = SearchFilterWidget;

SearchFilterWidget.prototype.render = function () {

    var widgetDiv = document.getElementById(this.widgetId);
    if (widgetDiv) {        
        this.renderWidget(widgetDiv);
    }
};

SearchFilterWidget.prototype.renderWidget = function (parentElement) {

    this.renderWrapperContainer(parentElement); //wrapperContainer added for [AVT-4216]

    var container = tsCreateDiv();
    container.id = "searchFilters";
    this.wrapperContainer.appendChild(container);
    var isDropDown = "";
    if (this.widgetParams["dropDownFormat"]) {
        isDropDown = this.widgetParams["dropDownFormat"].toLowerCase();
    }
    if (!this.articleContext.searchFilters)
        return;

    var currentPage = (location.href.indexOf("loadArticle.asp") > -1 ? "loadArticle.asp" : "default.asp");

    if (isDropDown == "true" || isDropDown == "t") {
        var filterForm = container.appendChild(tsCreateForm(currentPage));
        filterForm.appendChild(tsCreateHidden(encodeURIComponent(sTokenName), sToken));
        filterForm.appendChild(tsCreateHidden("doWork::WScontent::search", ""));
        filterForm.appendChild(tsCreateHidden("BOparam::WScontent::search::article_search_id", this.articleContext.articleId));
    }

    for (var i = 0; i < this.articleContext.searchFilters.length; i++) {

        var currentFilter = this.articleContext.searchFilters[i];
        if (currentFilter.values.length == 0) {
            continue;
        }

        if (isDropDown == "true" || isDropDown == "t") {
            var ul = filterForm.appendChild(tsCreateList(currentFilter.className + "-dropdown list-unstyled"));
            var listItem = ul.appendChild(tsCreateListItem());
            var elem = document.createElement("select");
            elem.setAttribute("onChange", "this.form.submit();");
            elem.setAttribute("name", "BOset::WScontent::SearchCriteria::" + encodeURIComponent(currentFilter.name));
            if (currentFilter.values.length > 1) {
                var defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.appendChild(document.createTextNode(currentFilter.label))
                elem.appendChild(defaultOption)
            }
            for (var j = 0; j < currentFilter.values.length; j++) {
                var boundValue = currentFilter.values[j][0];
                var boundLabel = currentFilter.values[j][1];
                var url = currentPage + "?" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
                url += "&BOset::WScontent::SearchCriteria::" + encodeURIComponent(currentFilter.name) + "=" + encodeURIComponent(boundValue);
                url += "&BOparam::WScontent::search::article_search_id=" + this.articleContext.articleId;
                url += "&doWork::WScontent::search";

                var addOption = document.createElement("option")
                addOption.value = boundValue;
                addOption.appendChild(document.createTextNode(boundLabel));
                elem.appendChild(addOption);
            }
            listItem.appendChild(elem);
			
        } else {
            var heading = document.createElement("h3");
            heading.appendChild(tsCreateSpan(currentFilter.label));
            container.appendChild(heading);
            var ul = container.appendChild(tsCreateList(currentFilter.className + " list-unstyled"));
			for (var j = 0; j < currentFilter.values.length; j++) 
			{
				var newItem = this.renderFilterElement(ul, currentFilter, currentFilter.values[j], currentPage);
				
				if(currentFilter.children!=undefined && currentFilter.children.length>0)  
				{
					for (var k = 0; k < currentFilter.children.length; k++) 
					{
						if(currentFilter.children[k].parentName != currentFilter.values[j][0]) continue;
						
						var currentChild = currentFilter.children[k];
						var elemId = "Filters::"+currentChild.parentName+"::"+currentChild.name;
						if(currentChild.values.length>0)
						{
							var expandListImg = document.createElement("img");
							expandListImg.src = currentChild.selectedValue ? "/Images/cminus.gif" : "/Images/cplus.gif";
							newItem.appendChild(expandListImg);
							expandListImg.setAttribute("onclick", "tsToggleChildFilter(event, '"+elemId+"')" ); 
						}
						var newSubItem = newItem.appendChild(tsCreateList(currentChild.className + " list-unstyled"));
						newSubItem.id = elemId;
						newSubItem.style.display = currentChild.selectedValue ? "block" : "none";
						
						for (var p = 0; p < currentChild.values.length; p++) 
						{	
							this.renderFilterElement(newSubItem, currentChild, currentChild.values[p], currentPage);
						}
						if (currentChild.selectedValue) {
							var clearUrl = currentPage + "?" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
							clearUrl += "&BOset::WScontent::SearchCriteria::" + encodeURIComponent(currentChild.name) + "="; 
							clearUrl += "&BOparam::WScontent::search::article_search_id=" + this.articleContext.articleId;
							clearUrl += "&doWork::WScontent::search";
							var clearItem = newSubItem.appendChild(tsCreateListItem("clear-filter"));
							clearItem.appendChild(tsCreateLink(clearUrl, currentChild.clearFilterLabel));
						}
					}
				}
			}	
        }
        if (currentFilter.selectedValue) {
            var clearUrl = currentPage + "?" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
            clearUrl += "&BOset::WScontent::SearchCriteria::" + encodeURIComponent(currentFilter.name) + "="; // Clear value
            clearUrl += "&BOparam::WScontent::search::article_search_id=" + this.articleContext.articleId;
            clearUrl += "&doWork::WScontent::search";
            var clearItem = ul.appendChild(tsCreateListItem("clear-filter"));
            clearItem.appendChild(tsCreateLink(clearUrl, currentFilter.clearFilterLabel));
        }
    }
};


SearchFilterWidget.prototype.renderFilterElement = function (parentElement, currentFilter, currentValues, currentPage) 
{
	var listItem = parentElement.appendChild(tsCreateListItem());
	var boundValue = currentValues[0];
	var boundLabel = currentValues[1];

	var url = currentPage + "?" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
	url += "&BOset::WScontent::SearchCriteria::" + encodeURIComponent(currentFilter.name) + "=" + encodeURIComponent(boundValue);
	url += "&BOparam::WScontent::search::article_search_id=" + this.articleContext.articleId;
	url += "&doWork::WScontent::search";

	var elem = document.createElement("a");
	elem.href = url;
	elem.title = boundLabel;
	elem.appendChild(document.createTextNode(boundLabel));

	listItem.appendChild(elem);

	if (boundValue === currentFilter.selectedValue) {
		elem.appendChild(tsCreateSpan("*"));
		elem.title += "*";
	}
	
	return listItem;
};




