/*
 *  The following widget(s) extend the WidgetMaster object defined in widgetParent.js
 */

/*
 *  LoginWidget
 *
 *  Displays the login form.
 */

function LoginWidget(widgetId, widgetParams, articleContext) {
    WidgetMaster.call(this, widgetId, widgetParams, articleContext);
}

LoginWidget.prototype = Object.create(WidgetMaster.prototype);
LoginWidget.prototype.constructor = LoginWidget;

LoginWidget.prototype.render = function () {
    var widgetDiv = document.getElementById(this.widgetId);
    if (widgetDiv) {
        this.renderWidget(widgetDiv);
    }
};

// renderWrapperContainer override
LoginWidget.prototype.renderWrapperContainer = function (parentElement) {
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

    return this.wrapperContainer;
};

LoginWidget.prototype.renderWidget = function (parentElement) {
    var accountLogin = this.articleContext.loginLabels["accountLogin"];
    var forgotPassword = this.articleContext.loginLabels["forgotPassword"];

    var wrapperContainer = this.renderWrapperContainer(parentElement); //wrapperContainer added for [AVT-4216]
    var container = tsCreateDiv("login-widget " + this.articleContext.loginLabels["loginBoxClass"]);

    var loginHeading = tsCreateHeading(this.widgetParams["title"]);
    var loginNameWrapper = tsCreateDiv("login-name form-group");
    var loginNameLabel = document.createElement("label");
    var loginName = tsCreateInputText("loginName", this.articleContext.loginLabels["formLoginName"], 34);

    var loginPasswordWrapper = tsCreateDiv("login-password form-group");
    var loginPasswordLabel = document.createElement("label");
    var loginPassword = tsCreateInputPassword("loginPassword", 34);

    var forgotLinkURL = "forgotPassword.asp?" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken) + "&targetPage=" + encodeURIComponent(targetPage) + "&useroption=1";
    var forgotLink = tsCreateLink(forgotLinkURL, this.widgetParams["forgot_password"]);

    var submitButton = tsCreateSubmit("login", this.widgetParams["submit"], "login-submit btn btn-default");

    var form = tsCreateForm("login.asp");
    var targetPage = "default.asp";

    form.appendChild(tsCreateHidden(sTokenName, sToken));
    form.appendChild(tsCreateHidden("targetPage", targetPage));
    form.appendChild(tsCreateHidden("doLogin", "1"));

    loginHeading.setAttribute('class', 'login-heading');
    form.appendChild(loginHeading);

    if (accountLogin == 'true') {
      parentElement.appendChild(wrapperContainer);

      loginNameLabel.appendChild(tsCreateText(this.widgetParams["username"]));
      loginName.setAttribute('class', 'form-control');
      loginNameWrapper.appendChild(loginNameLabel);
      loginNameWrapper.appendChild(loginName);
      loginNameWrapper.appendChild(tsCreateSpan("*", "required"));
      form.appendChild(loginNameWrapper);

      loginPasswordLabel.appendChild(tsCreateText(this.widgetParams["password"]));
      loginPassword.setAttribute('class', 'form-control');
      loginPasswordWrapper.appendChild(loginPasswordLabel);
      loginPasswordWrapper.appendChild(loginPassword);
      loginPasswordWrapper.appendChild(tsCreateSpan("*", "required"));
      form.appendChild(loginPasswordWrapper);

      if (forgotPassword == 'true') {
        forgotLink.setAttribute("class", "login-forgot-password");
        form.appendChild(forgotLink);
      }

      form.appendChild(submitButton);
    }

    container.appendChild(form);
    wrapperContainer.appendChild(container);
};
