// Online link to buy seats for the performance with the given id and optional promo code
function buySeats(id, promo) {

    // Used for HTML link, for example: <a href="javascript:buySeats('301E9DEE-E684-493D-9406-A79C95A1D3FB')">Buy Star Trek Performance</a>
    var url = "seatSelect.asp?BOparam::WSmap::loadBestAvailable::performance_ids=" + encodeURIComponent(id);
    url += "&createBO::WSmap=1";
    if (promo) {
        url += "&BOparam::WSmap::loadBestAvailable::promocode_access_code_url=" + encodeURIComponent(promo);
    }
    SubmitForm(url);
}

// Online link to buy seats for the performance with the given id and optional promo code
function buySeatsLink(id, promo, form, action) {

    // Used to create link in JavaScript, for example: anchorObj.onclick = buySeatsLink('301E9DEE-E684-493D-9406-A79C95A1D3FB', 'PROMO', formObj);
    return function () {
        form.action = action || "seatSelect.asp";
        if (action != "seatSelect.asp") {   
          addHiddenElementToForm(form, "BOparam::WSmap::loadMap::performance_ids", id);
        } else {
          addHiddenElementToForm(form, "BOparam::WSmap::loadBestAvailable::performance_ids", id);
        }
        addHiddenElementToForm(form, "createBO::WSmap", "1");
        if (promo) {
            addHiddenElementToForm(form, "BOparam::WSmap::loadBestAvailable::promocode_access_code_url", promo);
        }
        form.submit();
    };
}

// Online link to buy the bundle with the given id and optional promo code
function buyBundle(id, promo) {

    var url = "bundleSelect.asp?createBO::WSbundlemap=1&BOset::WSbundlemap::seatmap::bundle_id=" + encodeURIComponent(id);
    if (promo) {
        url += "&BOparam::WSbundlemap::loadBestAvailable::promocode_access_code_url=" + encodeURIComponent(promo);
    }
    SubmitForm(url);
}

// Online link to buy the bundle with the given id and optional promo code
function buyBundleLink(id, promo, form) {

    return function () {
        form.action = "bundleSelect.asp";
        addHiddenElementToForm(form, "createBO::WSbundlemap", "1");
        addHiddenElementToForm(form, "BOset::WSbundlemap::seatmap::bundle_id", id);
        if (promo) {
            addHiddenElementToForm(form, "BOparam::WSbundlemap::loadBestAvailable::promocode_access_code_url", promo);
        }
        form.submit();
    };
}

// Online link to buy the miscellaneous item with the given id and optional promo code
function buyItem(id, promo) {

    var url = "miscItemDetail.asp?doWork::WSmiscItem::load=Load&createBO::WSmiscItem=1&BOparam::WSmiscItem::load::item=" + encodeURIComponent(id);
    if (promo) {
        url += "&BOparam::WSmiscItem::load::promocode_access_code_url=" + encodeURIComponent(promo);
    }
    SubmitForm(url);
}

// Online link to buy the miscellaneous item with the given id and optional promo code
function buyItemLink(id, promo, form) {

    return function () {
        form.action = "miscItemDetail.asp";
        addHiddenElementToForm(form, "doWork::WSmiscItem::load", "Load");
        addHiddenElementToForm(form, "createBO::WSmiscItem", "1");
        addHiddenElementToForm(form, "BOparam::WSmiscItem::load::item", id);
        if (promo) {
            addHiddenElementToForm(form, "BOparam::WSmiscItem::load::promocode_access_code_url", promo);
        }
        form.submit();
    };
}

// Online link to buy the gift with the given id
function buyGift(id) {

    SubmitForm("donationDetails.asp?BOset::COgifts::Query::Clause::2::value=" + encodeURIComponent(id));
}

// Online link to buy the gift with the given id
function buyGiftLink(id, form) {

    return function () {
        form.action = "donationDetails.asp";
        addHiddenElementToForm(form, "BOset::COgifts::Query::Clause::2::value", id);
        form.submit();
    };
}

// Online link to buy the stored value item with the given id
function buyStoredValueItem(id, promo) {

    var url = "giftCertificateDetails.asp?BOset::WSstoredValueItemSearch::Query::Clause::2::value=" + encodeURIComponent(id);
    if (promo) {
        url += "&BOparam::WSstoredValueItemSearch::search::promocode_access_code_url=" + encodeURIComponent(promo);
    }
    SubmitForm(url);
}

// Online link to buy the stored value item with the given id
function buyStoredValueItemLink(id, promo, form) {

    return function () {
        form.action = "giftCertificateDetails.asp";
        addHiddenElementToForm(form, "BOset::WSstoredValueItemSearch::Query::Clause::2::value", id);
        if (promo) {
            addHiddenElementToForm(form, "BOparam::WSstoredValueItemSearch::search::promocode_access_code_url", promo);
        }
        form.submit();
    };
}

// Online link to view the article with the given id and optional promo code
function viewArticle(id, promo, contextId) {

    var url = "default.asp?doWork::WScontent::loadArticle=Load&BOparam::WScontent::loadArticle::article_id=" + encodeURIComponent(id);
    if (promo) {
        url += "&BOparam::WScontent::loadArticle::promocode_access_code_url=" + encodeURIComponent(promo);
    }
    if (contextId) {
        url += "&BOparam::WScontent::loadArticle::context_id=" + encodeURIComponent(contextId);
    }
    SubmitForm(url);
}

// Online link to view the article with the given id and optional promo code
function viewArticleLink(id, promo, form) {

    return function () {
        form.action = "default.asp";
        addHiddenElementToForm(form, "doWork::WScontent::loadArticle", "Load");
        addHiddenElementToForm(form, "BOparam::WScontent::loadArticle::article_id", id);
        if (promo) {
            addHiddenElementToForm(form, "BOparam::WScontent::loadArticle::promocode_access_code_url", promo);
        }
        form.submit();
    };
}

function upsellLink(title, articleId, objectId, cancelAction) {
    return function () {
        var articleUrl = "loadArticle.asp?BOparam::WScontent::loadArticle::article_id=" + articleId;
        articleUrl += "&BOparam::WScontent::loadArticle::context_id=" + objectId;
        articleUrl += "&BOparam::WScontent::loadArticle::getUpsell=1";
        new showUpsellPopup(title, articleUrl, cancelAction);
    };
}

function showAddOn(title, articleId, objectId, cancelAction, isFs, skipLabel) {

    if (articleId && objectId) {
        var articleUrl = "loadArticle.asp?BOparam::WScontent::loadArticle::article_id=" + articleId;
        articleUrl += "&BOparam::WScontent::loadArticle::context_id=" + objectId;
        articleUrl += "&BOparam::WScontent::loadArticle::getAddOn=1";
        new showUpsellPopup(title, articleUrl, cancelAction, isFs, skipLabel);
    }
}

function showUpsell(title, articleId, objectId, cancelAction) {

    if (articleId && objectId) {
        var articleUrl = "loadArticle.asp?BOparam::WScontent::loadArticle::article_id=" + articleId;
        articleUrl += "&BOparam::WScontent::loadArticle::context_id=" + objectId;
        articleUrl += "&BOparam::WScontent::loadArticle::getUpsell=1";
        new showUpsellPopup(title, articleUrl, cancelAction);
    }
}

function tsCreateInfoLink(url, title, className)
{
    var elem = document.createElement("a");
    elem.href = url;

    if (title) {
        elem.title = title;
        elem.appendChild(document.createTextNode(title));
    }
    if (className) {
        elem.className = className;
    }
    return elem;
}

// Helper function to avoid issues with browsers that by default show cached page when Back button is pressed (i.e. Safari 9)
function addHiddenElementToForm(form, name, value) {
    if (form[name])
      form[name].value = value;
    else
      form.appendChild(tsCreateHidden(name, value));
}
