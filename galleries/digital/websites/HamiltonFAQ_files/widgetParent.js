/*
  widgetParent.js
  Description: Methods for widgets that are called by Online and Desktop
*/

//
// WidgetMaster is for widgets to extend and saves us from writing duplicate code for each
//
function WidgetMaster(widgetId, widgetParams, articleContext) {

    this.widgetId = widgetId;
    this.widgetParams = widgetParams;
    this.articleContext = articleContext;
}

// method to provide wrapper div for dynamic css_style, css_id, css_class [AVT-4216]
WidgetMaster.prototype.renderWrapperContainer = function (parentElement) {

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

    return this.wrapperContainer;
};


/*
 *
 * Widget Prep Functions
 *
 */

function tsGetWindowSize()
{
  var res = new Array();
  if( typeof( window.innerWidth ) == 'number' )
  {
    //Non-IE
    res[0] = window.innerWidth;
    res[1] = window.innerHeight;
  }
  else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) )
  {
    //IE 6+ in 'standards compliant mode'
    res[0] = document.documentElement.clientWidth;
    res[1] = document.documentElement.clientHeight;
  }
  else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) )
  {
    //IE 4 compatible
    res[0] = document.body.clientWidth;
    res[1] = document.body.clientHeight;
  }
  return res;
}

function tsGetScrollXY()
{
  var scrOfX = 0, scrOfY = 0;
  if( typeof( window.pageYOffset ) == 'number' )
  {
    //Netscape compliant
    scrOfY = window.pageYOffset;
    scrOfX = window.pageXOffset;
  }
  else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) )
  {
    //DOM compliant
    scrOfY = document.body.scrollTop;
    scrOfX = document.body.scrollLeft;
  }
  else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) )
  {
    //IE6 standards compliant mode
    scrOfY = document.documentElement.scrollTop;
    scrOfX = document.documentElement.scrollLeft;
  }
  return [ scrOfX, scrOfY ];
}

function tsGetCoordinates( x, y, h, w )
{
  var winInfo = tsGetWindowSize();
  var scrInfo = tsGetScrollXY();

  // shift position according to scrolling
  x += scrInfo[0];
  y += scrInfo[1];

  if( x + w + 10 > ( winInfo[0] + scrInfo[0] ) )
    x = ( winInfo[0] + scrInfo[0] ) - w - 10;

  if( y + h + 10 > ( winInfo[1] + scrInfo[1] ) )
    y = ( winInfo[1] + scrInfo[1] ) - h - 10;

  return [ x, y ];
}

function tsOpenAddFriend()
{
    // open this where the mouse is
    var x = 150;
    var y = 100;
    var h = 725;
    var w = 700;

    var sTokenName = arguments[0];
    var sToken = arguments[1];

    var url = CommonPath + "/Widgets/addFriend.asp?" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
    openWidget( "addFriend", url, { h: h, w: w, x: x, y: y } );
}

// calendar opener
var tsCalTargets = new Array();
var tsCalForm = "";
var tsCalCallback = null;
var cur_sTokenName = null;

function tsOpenCalendar(_event, targets, form, showtime, callback_or_stokname, stoken)
{
  // open this where the mouse is
  var x = 0;
  var y = 0;

  if( arguments.length < 4 )
  {
    return;
  }

  evt = _event;
  tsCalTargets = targets.split( "," );
  tsCalForm = form;
  timeShow = showtime;

  //Start of DESKTOP specific
  if(arguments.length == 5)
    tsCalCallback = callback_or_stokname; // TODO: $$$ this needs to be fixed !!!
  //End of DESKTOP specific

  //Start of ONLINE specific
  if (arguments.length == 6)
  {
  	sTokenName = callback_or_stokname;
	if(!sToken)
	 	sToken = (articleContext && articleContext.sToken) ? articleContext.sToken: stoken;
  }
  //End of ONLINE specific

  var h = 350;
  var w = 350;

  if( timeShow != "" && timeShow == "false" )
  {
    h = 300;
    w = 300;
  }

  if( evt )
  {
    x = evt.clientX;
    y = evt.clientY;
  }
  else
  {
    x = parseInt( document.body.clientWidth / 2 - w / 2 );
    y = parseInt( document.body.clientHeight / 2 - h / 2);
  }

  winInfo = tsGetCoordinates( x, y, h, w );
  x = winInfo[0];
  y = winInfo[1];

  var url = CommonPath + "/Widgets/";
  var query = "?tsFocusForm=" + encodeURIComponent(tsCalForm) + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
  var paramCalendar = null;

  if( timeShow != "" )
  {
    query += "&tsShowTime=" + encodeURIComponent( timeShow );
  }

  // add all target primitives to the URL so we can read localized dates in the calendar
  for(var i = 0; i < tsCalTargets.length; i++) {
    var input = document.getElementById(tsCalTargets[i]);

    if(input) {
        if(input.name.length > 7 && input.name.substr(0, 7) == "BOset::") {
            // show localized calendar if we saw at least one primitive (i.e. BOset::)
            query += "&" + encodeURIComponent(input.name) + "=" + encodeURIComponent(input.value);
            paramCalendar = false;
        }
        else if(paramCalendar == null) {
            // this may be either BOparam:: or a new criteria value with an arbitrary name
            paramCalendar = true;
        }
    }
  }

  url += (paramCalendar ? "paramCalendar.asp" : "calendar.asp") + query;

  openWidget( "calendar", url, { h: h, w: w, x: x, y: y } );
}

function tsApplyCalendar(formattedDate)
{
  for( var x = 0; x < tsCalTargets.length; x++ )
  {
    document.getElementById( tsCalTargets[x] ).value = formattedDate;
  }

  if( tsCalCallback != null )
    tsCalCallback();
}

// for duration primitives
var tsDurTargets = new Array();
var tsDurForm = "";
function tsOpenDuration()
{
  // open this where the mouse is
  var x = 0;
  var y = 0;

  evt = arguments[0];
  tsDurTargets = arguments[1].split( "," );
  tsDurForm = arguments[2];
  //Start of ONLINE only
  if (arguments.length > 3)
  {
    sTokenName = arguments[3];
    sToken = arguments[4];
  }
  //End of ONLINE
  var h = 290;
  var w = 175;

  if( evt )
  {
    x = evt.clientX;
    y = evt.clientY;
  }
  else
  {
    x = parseInt( document.body.clientWidth / 2 - w / 2 );
    y = parseInt( document.body.clientHeight / 2 - h / 2);
  }

  winInfo = tsGetCoordinates( x, y, h, w );
  x = winInfo[0];
  y = winInfo[1];

  var url = CommonPath + "/Widgets/duration.asp?tsFocusForm=" + encodeURIComponent( tsDurForm ) + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);

  if( tsDurTargets.length == 1 )
  {
    if( document.getElementById( tsDurTargets[0] ) && document.getElementById( tsDurTargets[0] ).value != "" )
    {
      url += "&tsCurrentValue=" + encodeURIComponent( document.getElementById( tsDurTargets[0] ).value );
    }
  }

  openWidget( "duration", url, { h: h, w: w, x: x, y: y } );
}

function tsApplyDuration( duration )
{
  for( var x = 0; x < tsDurTargets.length; x++ )
  {
    document.getElementById( tsDurTargets[x] ).value = duration;
  }
}

var tsPerfSelectCallback = null;
function tsOpenPerformanceSelector( series, callback )
{
  if( callback )
    tsPerfSelectCallback = callback;
  else
    tsPerfSelectCallback = null;

  var url = CommonPath + "/Widgets/perfselect.asp?" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
  for( x = 0; x < series.length; x++ )
  {
      url += "&BOset::WOSperformances::Query::Clause::1::value=" + encodeURIComponent(series[x]);
  }

  openWidget( "performanceselect", url, { h: 406, w: 300 } );
}

function tsApplyPerformanceSelector(perfs, seriesFields)
{
  closeWidget( "performanceselect" );
  if( tsPerfSelectCallback )
      tsPerfSelectCallback(perfs, seriesFields);
}

function tsOpenColour( evt, ID )
{

  var h = 300;
  var w = 420;

  if( evt )
  {
    x = evt.clientX;
    y = evt.clientY;
  }
  else
  {
    x = parseInt( document.body.clientWidth / 2 - w / 2 );
    y = parseInt( document.body.clientHeight / 2 - h / 2);
  }

  winInfo = tsGetCoordinates( x, y, h, w );
  x = winInfo[0];
  y = winInfo[1];

  var url = CommonPath + "/Widgets/colour.asp?FocusID=" + encodeURIComponent( ID );
  url += "&FocusColour=" + encodeURIComponent( document.getElementById( ID ).value ) + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);

  openWidget( "colour", url, { h: h, w: w, x: x, y: y } );

}

function tsScreenSummary( objectHandle, objectType, objectMethod )
{
  scrHt = screen.availHeight;
  scrWd = screen.availWidth;
  if( scrHt > 768 ) {
    scrHt = 768;
  }
  if( scrWd > 1024 ) {
    scrWd = 1024;
  }
  var x = 0;
  var y = 0;
  if( x + scrWd > screen.availWidth ) {
    x = x - ( screen.availWidth - x + scrWd );
  }
  if( y + scrHt > screen.availHeight ) {
    y = y - ( screen.availHeight - y + scrHt );
  }

  var url = CommonPath + "/Widgets/summary_result.asp?objectHandle=" + encodeURIComponent(objectHandle);
  url += "&objectType=" + encodeURIComponent(objectType) + "&objectMethod=" + encodeURIComponent(objectMethod) + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);

  winArgs = "height=" + scrHt + ",width=" + scrWd + ",scrollbars=1,resizable=1,toolbar=yes,top=" + y + ",left=" + x + ",status=1,dependent=1";
  winName = window.open( url, "Reports", winArgs );
  if( window.opener )
  {
    window.opener.openWindows[ "Reports" ] = winName;
  }
  winName.focus();
}


function tsUploadSummary( objectHandle, objectType, objectMethod, template, templates, downloadFileName, protocol, username, password, URI )
{
  // close the widget
  closeWidget( "summarywidget" );
  // process the download into an hidden iframe
  var url = CommonPath + "/Widgets/summary_result.asp?objectHandle=" + encodeURIComponent(objectHandle);
  url += "&objectType=" + encodeURIComponent(objectType) + "&objectMethod=" + encodeURIComponent(objectMethod);
  url += "&templates=" + encodeURIComponent(templates) + "&template=" + encodeURIComponent(template);
  url += "&downloadFileName=" + encodeURIComponent(downloadFileName) + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);

  url += "&target=" + encodeURIComponent(protocol.toLowerCase());
  url += "&username=" + encodeURIComponent(username);
  url += "&password=" + encodeURIComponent(password);
  url += "&url=" + encodeURIComponent(URI);


  if (document.getElementById( "BOcustBio::Request::from_customer::0" ) != undefined)
      url += "&from_customer=" + encodeURIComponent(document.getElementById( "BOcustBio::Request::from_customer::0" ).value);
  widget = document.createElement( "iframe" );
  widget.style.borderWidth = "0";
  widget.style.height = "0px";
  widget.style.width = "0px";
  document.body.appendChild( widget );
  widget.src = url;

}

function tsDownloadSummary( objectHandle, objectType, objectMethod, template, templates, downloadFileName )
{
  // close the widget
  closeWidget( "summarywidget" );
  // process the download into an hidden iframe
  var url = CommonPath + "/Widgets/summary_result.asp?objectHandle=" + encodeURIComponent(objectHandle);
  url += "&objectType=" + encodeURIComponent(objectType) + "&objectMethod=" + encodeURIComponent(objectMethod) + "&target=download";
  url += "&templates=" + encodeURIComponent(templates) + "&template=" + encodeURIComponent(template) + "&downloadFileName=" + encodeURIComponent(downloadFileName) + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);

  if (document.getElementById( "BOcustBio::Request::from_customer::0" ) != undefined)
      url += "&from_customer=" + encodeURIComponent(document.getElementById( "BOcustBio::Request::from_customer::0" ).value);
  widget = document.createElement( "iframe" );
  widget.style.borderWidth = "0";
  widget.style.height = "0px";
  widget.style.width = "0px";
  document.body.appendChild( widget );
  widget.src = url;

}

function tsUploadExtract( objectHandle, objectType, objectMethod, template, templates, downloadFileName, protocol, username, password, URI )
{
  // close the widget
  closeWidget( "extractwidget" );

  var url = CommonPath + "/Widgets/extract_result.asp?objectHandle=" + encodeURIComponent(objectHandle);
  url += "&objectType=" + encodeURIComponent(objectType) + "&objectMethod=" + encodeURIComponent(objectMethod);
  url += "&templates=" + encodeURIComponent(templates) + "&template=" + encodeURIComponent(template) + "&downloadFileName=" + encodeURIComponent(downloadFileName) + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);

  url += "&target=" + encodeURIComponent(protocol.toLowerCase());
  url += "&username=" + encodeURIComponent(username);
  url += "&password=" + encodeURIComponent(password);
  url += "&url=" + encodeURIComponent(URI);

  widget = document.createElement( "iframe" );
  widget.style.borderWidth = "0";
  widget.style.height = "0px";
  widget.style.width = "0px";
  document.body.appendChild( widget );
  widget.src = url;

}

function tsDownloadExtract( objectHandle, objectType, objectMethod, template, templates, downloadFileName, tracking, generateCorrespondence, warning, srcForm, menuName, showTemplate, corrHandle, corrWork, corrObj )
{
  // close the widget
  closeWidget( "extractwidget" );
  // process the download into an hidden iframe
  var url = CommonPath + "/Widgets/extract_result.asp?objectHandle=" + encodeURIComponent(objectHandle);
  url += "&objectType=" + encodeURIComponent(objectType) + "&objectMethod=" + encodeURIComponent(objectMethod) + "&target=download";
  url += "&templates=" + encodeURIComponent(templates) + "&template=" + encodeURIComponent(template) + "&downloadFileName=" + encodeURIComponent(downloadFileName) + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
  url += "&tracking=" + encodeURIComponent(tracking) + "&generateCorrespondence=" + encodeURIComponent(generateCorrespondence) + "&warning=" + encodeURIComponent(warning);
  url += "&srcForm=" + encodeURIComponent(srcForm) + "&menuName=" + encodeURIComponent(menuName) + "&showTemplate=" + encodeURIComponent(showTemplate);
  if(corrHandle!=undefined)
	url += "&correspondenceObjectHandle="+encodeURIComponent(corrHandle);
  if(corrWork!=undefined)
	url += "&correspondenceObjectMethod="+encodeURIComponent(corrWork);
  if(corrObj!=undefined)
	url += "&correspondenceObjectType="+encodeURIComponent(corrObj);

  widget = document.createElement( "iframe" );
  widget.style.borderWidth = "0";
  widget.style.height = "0px";
  widget.style.width = "0px";
  document.body.appendChild( widget );
  widget.src = url;

}

function tsOpenExtract( titleKey, objectHandle, objectType, objectMethod, template, showTemplate, templates, downloadFileName, srcForm, menuName, warning, sTokenName, sToken )
{
  var sendForm = srcForm ? document.forms[ srcForm ] : document.forms[0];
  var btnName = menuName ? menuName : "tsExtract";

  // hold onto original target and action
  var srcTarget = sendForm.target;
  var srcAction = sendForm.action;
  var oHdl = document.createElement( "INPUT" );
  var oMth = document.createElement( "INPUT" );
  var oTyp = document.createElement( "INPUT" );




  var oKey = document.createElement( "INPUT" );
  var oForm = document.createElement( "INPUT" );
  var oMenuName = document.createElement( "INPUT" );
  var oTmp = document.createElement( "INPUT" );
  var oFname = document.createElement("INPUT");
  var oTemplate = document.createElement("INPUT");
  var oShowTemplate = document.createElement("INPUT");
  var oFormat = document.createElement( "INPUT" );
  var oGenCorrespondence = document.createElement( "INPUT" );
  var oTracking = document.createElement( "INPUT" );
  var oWarning = document.createElement( "INPUT" );

  var hasCorrespondenceCode = false;
  if (document.getElementsByName('BOset::' + objectHandle + '::Correspondence::code').length > 0 &&
        document.getElementsByName('BOset::' + objectHandle + '::Correspondence::code')[0].value != "")
  {
      hasCorrespondenceCode = true;
  }

  var useMessageBOForExtract = (objectType == "TScustomerCO" && objectMethod == "extract" && hasCorrespondenceCode == true);


  if (useMessageBOForExtract)
  {
	  var corrObjHndl = document.createElement( "INPUT" );
	  var corrObjMth = document.createElement( "INPUT" );
	  var corrObjTyp = document.createElement( "INPUT" );

	  corrObjHndl.type = "hidden";
	  corrObjHndl.name = "correspondenceObjectHandle";
	  corrObjHndl.id = "correspondenceObjectHandle";
	  corrObjHndl.value = "BOmessageExtract";

	  corrObjMth.type = "hidden";
	  corrObjMth.name = "correspondenceObjectMethod";
	  corrObjMth.id = "correspondenceObjectMethod";
	  corrObjMth.value = "extractCorrespondence";

	  corrObjTyp.type = "hidden";
	  corrObjTyp.name = "correspondenceObjectType";
	  corrObjTyp.id = "correspondenceObjectType";
	  corrObjTyp.value = "TSmessageBO";

	  sendForm.appendChild( corrObjHndl );
	  sendForm.appendChild( corrObjMth );
	  sendForm.appendChild( corrObjTyp );
  }

  oHdl.type = "hidden";
  oHdl.name = "objectHandle";
  oHdl.id = "objectHandle";
  oHdl.value = objectHandle;


  oMth.type = "hidden";
  oMth.name = "objectMethod";
  oMth.id = "objectMethod";
  oMth.value = objectMethod;


  oTyp.type = "hidden";
  oTyp.name = "objectType";
  oTyp.id = "objectType";
  oTyp.value = objectType;


  oKey.type = "hidden";
  oKey.name = "titleKey";
  oKey.id = "titleKey";
  oKey.value = titleKey;

  oForm.type = "hidden";
  oForm.name = "srcForm";
  oForm.id = "srcForm";
  oForm.value = srcForm;

  oMenuName.type = "hidden";
  oMenuName.name = "menuName";
  oMenuName.id = "menuName";
  oMenuName.value = menuName;

  oShowTemplate.type = "hidden";
  oShowTemplate.name = "showTemplate";
  oShowTemplate.id = "showTemplate";
  oShowTemplate.value = showTemplate;

  oGenCorrespondence.type = "hidden";
  oGenCorrespondence.name = "generateCorrespondence";
  oGenCorrespondence.id = "generateCorrespondence";

  oTracking.type = "hidden";
  oTracking.name = "tracking";
  oTracking.id = "tracking";

  oWarning.type = "hidden";
  oWarning.name = "warning";
  oWarning.id = "warning";
  oWarning.value = warning;


  var tracking;
  var generateCorrespondence;

  if (document.getElementById('BOparam::' + objectHandle + '::extract::tracking') != undefined)
    oTracking.value = document.getElementById('BOparam::' + objectHandle + '::extract::tracking').value;

  if (document.getElementById('BOparam::' + objectHandle + '::extract::generateCorrespondence::0') != undefined)
    oGenCorrespondence.value = document.getElementById('BOparam::' + objectHandle + '::extract::generateCorrespondence::0').value;

  if( !showTemplate )
  {
      oTmp.type = "hidden";
      oTmp.name = "noTemplate";
      oTmp.id = "noTemplate";
      oTmp.value = 1;

      oTemplate.type = "hidden";
      oTemplate.name = "template";
      oTemplate.id = "template";
      oTemplate.value = template;
   }

  oFname.type = "hidden";
  oFname.name = "downloadFileName";
  oFname.value = downloadFileName;
  oFname.id = "downloadFileName";

  oFormat.type = "hidden";
  oFormat.name = "templates";
  oFormat.value = templates;
  oFormat.id = "templates";

  sendForm.appendChild( oHdl );
  sendForm.appendChild( oMth );
  sendForm.appendChild( oTyp );
  sendForm.appendChild( oKey );
  sendForm.appendChild( oForm );
  sendForm.appendChild( oMenuName );
  sendForm.appendChild( oFname );
  sendForm.appendChild( oFormat );
  sendForm.appendChild( oTracking );
  sendForm.appendChild( oWarning );
  sendForm.appendChild( oGenCorrespondence );
  sendForm.appendChild( oShowTemplate );
  if( !showTemplate )
  {
    sendForm.appendChild( oTmp );
    sendForm.appendChild( oTemplate );
  }
  if( (titleKey == "" && templates == "") || (titleKey == "Screen" && templates != "") )
  {
    // close the widget
    closeWidget( "extractwidget" );

    var url = CommonPath + "/Widgets/extract_result.asp";
    scrHt = screen.availHeight;
    scrWd = screen.availWidth;
    if( scrHt > 768 ) {
      scrHt = 768;
    }
    if( scrWd > 1024 ) {
      scrWd = 1024;
    }
    var x = 0;
    var y = 0;
    if( x + scrWd > screen.availWidth ) {
      x = x - ( screen.availWidth - x + scrWd );
    }
    if( y + scrHt > screen.availHeight ) {
      y = y - ( screen.availHeight - y + scrHt );
    }

    winArgs = "height=" + scrHt + ",width=" + scrWd + ",scrollbars=1,resizable=1,toolbar=yes,top=" + y + ",left=" + x + ",status=1,dependent=1";
    winName = window.open( "", "Extracts", winArgs );
    if( window.opener )
      window.opener.openWindows[ "Extracts" ] = winName;

    sendForm.target = "Extracts";
    sendForm.action = url;
    sendForm.submit();

    winName.focus();

  }
  else
  {
    tsShowButtonMenu( document.getElementById( btnName + "Menu"  ), btnName );
    var url = CommonPath + "/Widgets/extract.asp";

    sendForm.target = "extractwidget";
    sendForm.action = url;
    sendForm.submit();
    // display our widget
    openWidgets[ "extractwidget" ] = true;
    var widget = document.getElementById( "Widget::extractwidget" );
    var shadow = document.getElementById( "Shadow::extractwidget" );
    shadow.style.zIndex = widgetIdx++;
    widget.style.zIndex = widgetIdx++;

    var left = document.body.clientWidth / 2 - 150 + document.body.scrollLeft;
    var top = document.body.clientHeight / 2 - 150 + document.body.scrollTop;

    widget.style.left = left;
    widget.style.top = top;

    shadow.style.left = left + 10;
    shadow.style.top = top + 10;

    shadow.style.display = "inline";
    widget.style.display = "block";
  }

  try
  {
    var elem=document.getElementById('objectHandle');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('objectMethod');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('objectType');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('titleKey');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('downloadFileName');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('templates');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('generateCorrespondence');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('tracking');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('srcForm');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('menuName');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('showTemplate');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('warning');
    elem.parentNode.removeChild(elem)

    if( !showTemplate )
    {
        elem=document.getElementById('noTemplate');
        elem.parentNode.removeChild(elem)
        elem=document.getElementById('template');
        elem.parentNode.removeChild(elem)
    }

    elem = document.getElementById('correspondenceObjectHandle');
    if(elem!=undefined)
        elem.parentNode.removeChild(elem);

    elem = document.getElementById('correspondenceObjectMethod');
    if (elem != undefined)
        elem.parentNode.removeChild(elem);

    elem = document.getElementById('correspondenceObjectType');
    if (elem != undefined)
        elem.parentNode.removeChild(elem);

  }
  catch( e )
  {
    // nada
  }

  sendForm.target = srcTarget;
  sendForm.action = srcAction;

}

function tsOpenSummary( titleKey, objectHandle, objectType, objectMethod, template, showTemplate, templates, downloadFileName, srcForm, menuName, warning, sTokenName, sToken, fromWidget )
{
  var sendForm = srcForm ? document.forms[ srcForm ] : document.forms[0];
  var btnName = menuName ? menuName : "tsSummary";
  if (fromWidget == undefined) fromWidget = false;
  // hold onto original target and action
  var srcTarget = sendForm.target;
  var srcAction = sendForm.action;

  if (document.getElementById("objectHandle") && !fromWidget)
  {
    document.getElementById("objectHandle").value = objectHandle;
  }
  else
  {
    var oHdl = document.createElement( "input" );
    oHdl.type = "hidden";
    oHdl.name = "objectHandle";
    oHdl.id = "objectHandle";
    oHdl.value = objectHandle;
    sendForm.appendChild(oHdl);
  }

  if (document.getElementById("objectSrcForm") && !fromWidget)
  {
    document.getElementById("objectSrcForm").value = srcForm;
  }
  else
  {
    var oSrcForm = document.createElement( "input" );
    oSrcForm.type = "hidden";
    oSrcForm.name = "objectSrcForm";
    oSrcForm.id = "objectSrcForm";
    oSrcForm.value = srcForm;
    sendForm.appendChild( oSrcForm );
  }

  if (document.getElementById("objectMethod") && !fromWidget)
  {
    document.getElementById("objectMethod").value = objectMethod;
  }
  else
  {
    var oMth = document.createElement( "input" );
    oMth.type = "hidden";
    oMth.name = "objectMethod";
    oMth.id = "objectMethod";
    oMth.value = objectMethod;
    sendForm.appendChild( oMth );
  }

  if (document.getElementById("objectType") && !fromWidget)
  {
    document.getElementById("objectType").value = objectType;
  }
  else
  {
    var oTyp = document.createElement( "input" );
    oTyp.type = "hidden";
    oTyp.name = "objectType";
    oTyp.id = "objectType";
    oTyp.value = objectType;
    sendForm.appendChild( oTyp );
  }

  if (document.getElementById("titleKey") && !fromWidget)
  {
    document.getElementById("titleKey").value = titleKey;
  }
  else
  {
    var oKey = document.createElement( "input" );
    oKey.type = "hidden";
    oKey.name = "titleKey";
    oKey.id = "titleKey";
    oKey.value = titleKey;
    sendForm.appendChild( oKey );
  }

  if (document.getElementById("downloadFileName") && !fromWidget)
  {
    document.getElementById("downloadFileName").value = downloadFileName;
  }
  else
  {
    var oFname = document.createElement( "input" );
    oFname.type = "hidden";
    oFname.name = "downloadFileName";
    oFname.id = "downloadFileName";
    oFname.value = downloadFileName;
    sendForm.appendChild( oFname );
  }

  if (document.getElementById("templates") && !fromWidget)
  {
    document.getElementById("templates").value = templates;
  }
  else
  {
    var oFormat = document.createElement( "input" );
    oFormat.type = "hidden";
    oFormat.name = "templates";
    oFormat.id = "templates";
    oFormat.value = templates;
    sendForm.appendChild( oFormat );
  }

  if( !showTemplate )
  {
    if (document.getElementById("noTemplate") && !fromWidget)
    {
      document.getElementById("noTemplate").value = 1;
    }
    else
    {
      var oTmp = document.createElement( "input" );
      oTmp.type = "hidden";
      oTmp.name = "noTemplate";
      oTmp.id = "noTemplate";
      oTmp.value = 1;
      sendForm.appendChild( oTmp );
    }

    if (document.getElementById("template") && !fromWidget)
    {
      document.getElementById("template").value = template;
    }
    else
    {
      var oTemplate = document.createElement( "input" );
      oTemplate.type = "hidden";
      oTemplate.name = "template";
      oTemplate.id = "template";
      oTemplate.value = template;
      sendForm.appendChild( oTemplate );
    }
  }





  if( (titleKey == "" && templates == "") || (titleKey == "Screen" && templates != "") )
  {
    // close the widget
    closeWidget( "summarywidget" );

    var url;
    if (document.getElementById( "BOcustBio::Request::from_customer::0" ) != undefined)
      url = CommonPath + "/Widgets/summary_result.asp?from_customer=" + encodeURIComponent(document.getElementById( "BOcustBio::Request::from_customer::0" ).value);
    else
	  	url = CommonPath + "/Widgets/summary_result.asp";

    scrHt = screen.availHeight;
    scrWd = screen.availWidth;
    if( scrHt > 768 ) {
      scrHt = 768;
    }
    if( scrWd > 1024 ) {
      scrWd = 1024;
    }
    var x = 0;
    var y = 0;
    if( x + scrWd > screen.availWidth ) {
      x = x - ( screen.availWidth - x + scrWd );
    }
    if( y + scrHt > screen.availHeight ) {
      y = y - ( screen.availHeight - y + scrHt );
    }

    winArgs = "height=" + scrHt + ",width=" + scrWd + ",scrollbars=1,resizable=1,toolbar=yes,top=" + y + ",left=" + x + ",status=1,dependent=1";
    winName = window.open( "", "Reports", winArgs );
    if( window.opener )
      window.opener.openWindows[ "Reports" ] = winName;

    sendForm.target = "Reports";
    sendForm.action = url;
    sendForm.submit();

    winName.focus();

  }
  else
  {

    tsShowButtonMenu( document.getElementById( btnName + "Menu"  ), btnName );
    var url;
    if (document.getElementById( "BOcustBio::Request::from_customer::0" ) != undefined)
      url = CommonPath + "/Widgets/summary.asp?from_customer=" + document.getElementById( "BOcustBio::Request::from_customer::0" ).value + "&";
    else
	    url = CommonPath + "/Widgets/summary.asp?";

    url += oSrcForm.name + "=" + oSrcForm.value

	sendForm.target = "summarywidget";
    sendForm.action = url;
    sendForm.submit();

    // display our widget
    openWidgets[ "summarywidget" ] = true;
    var widget = document.getElementById( "Widget::summarywidget" );
    var shadow = document.getElementById( "Shadow::summarywidget" );

    shadow.style.zIndex = widgetIdx++;
    widget.style.zIndex = widgetIdx++;

    var left = document.body.clientWidth / 2 - 150 + document.body.scrollLeft;
    var top = document.body.clientHeight / 2 - 150 + document.body.scrollTop;

    widget.style.left = left;
    widget.style.top = top;

    shadow.style.left = left + 10;
    shadow.style.top = top + 10;

    shadow.style.display = "inline";
    widget.style.display = "block";
  }

    var parentElem = oMth.parentElement;

    var elem=document.getElementById('objectHandle');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('objectMethod');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('objectSrcForm');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('objectType');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('titleKey');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('downloadFileName');
    elem.parentNode.removeChild(elem)
    elem=document.getElementById('templates');
    elem.parentNode.removeChild(elem)

    if( !showTemplate )
    {
        elem=document.getElementById('noTemplate');
        elem.parentNode.removeChild(elem)
        elem=document.getElementById('template');
        elem.parentNode.removeChild(elem)
    }

  sendForm.target = srcTarget;
  sendForm.action = srcAction;
}

function DoAction( inValue )
{
  try
  {
    window.event.cancelBubble = true;
  }
  catch( e )
  {
    // ignore, mozilla seems to not like this
  }

  switch( inValue )
  {
    case "logout" :
      LogOut();
      break;
    case "password" :
      openWidget( "password", CommonPath + "/Widgets/changePass.asp", { h: 225, w: 400 } );
      break;
    case "override" :
      openWidget( "override", CommonPath + "/Widgets/initOverride.asp", { h: 225, w: 400 } );
      break;
    case "role" :
      openWidget( "role", CommonPath + "/Widgets/changeRole.asp", { h: 255, w: 450 } );
      break;
    case "myaudienceview" :
      if( window.WindowPop != undefined )
      {
        WindowPop( 'myaudienceview' );
      }
      else
      {
        tabWindowPop( 'myaudienceview' );
      }
      break;
    case "about" :
      openWidget( "version", CommonPath + "/Widgets/version.asp", { h: 500, w: 700 } );
      break;
    default :
      break;  }
}

// calls the event for the key being pressed
function GetKey( evt )
{
  key = 0;

  try
  {
    if( window.event.srcElement.type != undefined )
    {
      return;
    }
  }
  catch( e )
  {
      //alert('widgetParent.js : evt.target : ' + evt.target);
      if(evt){
    if( evt.target.type != undefined )
    {
      return;
    }
  }
  }

  try
  {
    key = window.event.keyCode;
  }
  catch( e )
  {
    try
    {
      // mozilla event handler
      key = evt.which;
    }
    catch( e )
    {
      // nada
      return;
    }
  }
  switch( key )
  {
    case 65:
      DoAction( "about" );
      break;
    case 76:
      DoAction( "logout" );
      break;
    case 77:
      DoAction( "myaudienceview" );
      break;
    case 79:
      DoAction( "override" );
      break;
    case 80:
      DoAction( "password" );
      break;
    case 83:
      DoAction( "role" );
      break;
    default:
      break;
  }
}

// Widget functions
var tsConfirmFunction = null;
var tsExtractWarning = null;
var tsExtractParameters = new Array();
var openWidgets = new Array();
var widgetIdx = 100;  // Start with a large z-index incase parent screen has any non-zero z-index controls

var avAlertMessage = "";

function getAVAlertMessage()
{
    return avAlertMessage;
}

function AValert( msg )
{
  avAlertMessage = msg;
  var url = CommonPath + "/Widgets/alert.asp?" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
  openWidget("alert", url, { h: 220, w: 300, message: msg });
}

function AVconfirm( msg, func)
{
  tsConfirmFunction = func;
  var url = CommonPath + "/Widgets/confirm.asp?message=" + encodeURIComponent(msg) + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
  openWidget( "confirm", url, { h: 220, w: 300 } );
}

function AVExtractConfirm( msg, titleKey, objectHandle, objectType, objectMethod, template, showTemplate, templates, downloadFileName, srcForm, menuName, warning, sTokenName, sToken )
{
  tsExtractParameters[0] = titleKey;
  tsExtractParameters[1] = objectHandle;
  tsExtractParameters[2] = objectType;
  tsExtractParameters[3] = objectMethod;
  tsExtractParameters[4] = template;
  tsExtractParameters[5] = showTemplate;
  tsExtractParameters[6] = templates;
  tsExtractParameters[7] = downloadFileName;
  tsExtractParameters[8] = srcForm;
  tsExtractParameters[9] = menuName;
  tsExtractParameters[10] = warning;
  tsExtractParameters[11] = sTokenName;
  tsExtractParameters[12] = sToken;
  tsConfirmFunction = AVExtractRetry;
  var url = CommonPath + "/Widgets/confirm.asp?message=" + encodeURIComponent(msg) + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
  openWidget( "confirm", url, { h: 220, w: 300 } );
}

function AVExtractRetry( val )
{
  if (val == true)
  tsOpenExtract(tsExtractParameters[0],
                tsExtractParameters[1],
                tsExtractParameters[2],
                tsExtractParameters[3],
                tsExtractParameters[4],
                tsExtractParameters[5],
                tsExtractParameters[6],
                tsExtractParameters[7],
                tsExtractParameters[8],
                tsExtractParameters[9],
                tsExtractParameters[10],
                tsExtractParameters[11],
                tsExtractParameters[12]);
}

function confirmWidget( val )
{
  closeWidget( "confirm" );
  tsConfirmFunction( val )
}

function AVinvoice( invoice, mkey, key, sTokenName, sToken )
{
  tsShowButtonMenu( document.getElementById( mkey ), key );

  openWidget( "invoice", CommonPath + "/Widgets/invoice.asp?" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken) + "&BOparam::BOorder::invoice::target=" + encodeURIComponent(invoice), { h: 225, w: 450 } );
}

// Mass add result nodes in basic form
function AVBIResult( hdl, bo_type )
{
  var url = CommonPath + "/Widgets/bi_results.asp?handle=" + encodeURIComponent(hdl) + "&type=" + encodeURIComponent(bo_type) + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
  openWidget( "bi_result", url, { h: 499, w: 800 } );
}

// Edit a BI Node or add a new one
function AVBIEdit( hdl, bo_type, path, ctrlId, cursorPos )
{
  var url = CommonPath + "/Widgets/bi_edit.asp?handle=" + encodeURIComponent(hdl) + "&type=" + encodeURIComponent(bo_type) + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
  if( path != null )
      url += "&path=" + encodeURIComponent(path);
  if (ctrlId != null)
      url += "&ctrlId=" + encodeURIComponent(ctrlId);
  if (cursorPos != null)
      url += "&cursorPos=" + encodeURIComponent(cursorPos);

  openWidget( "bi_edit", url, { h: 505, w: 450 } );
}

// Edit a BI Node or add a new one
function AVbuildLink( contentName, encodePermalink, showBaseURL, showUnsubscribe, addAnalyitcs, showLinkTag )
{
  var url = CommonPath + "/Widgets/linkBuilder.asp?contentName=" + encodeURIComponent(contentName) + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
  if ((encodePermalink != undefined) && (encodePermalink == true))
  {
       url += "&encodePermalink=true";
  }
  if ((showBaseURL != undefined) && (showBaseURL == true))
  {
    url += "&showBaseURL=true";
  }
  if ((showUnsubscribe != undefined) && (showUnsubscribe == true))
  {
    url += "&showUnsubscribe=true";
  }
  if ((addAnalyitcs != undefined) && (addAnalyitcs == true)) {
      url += "&addAnalyitcs=true";
  }
  if ((showLinkTag != undefined) && (showLinkTag == true)) {
      url += "&showLinkTag=true";
  }
  openWidget( "linkBuilder", url, { h: 225, w: 600 } );
}

function AVbuildWebWidget(contentName, showBaseURL, showUnsubscribe, addAnalyitcs) {
    var url = CommonPath + "/Widgets/webWidgetBuilder.asp?contentName=" + encodeURIComponent(contentName) + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
    if ((showBaseURL != undefined) && (showBaseURL == true)) {
        url += "&showBaseURL=true";
    }
    if ((showUnsubscribe != undefined) && (showUnsubscribe == true)) {
        url += "&showUnsubscribe=true";
    }
    if ((addAnalyitcs != undefined) && (addAnalyitcs == true)) {
        url += "&addAnalyitcs=true";
    }
    openWidget("webWidgetBuilder", url, { h: 420, w: 600 });
}

function AVbuildArticleLink(target, contextId) {

    var url = CommonPath + "/Widgets/articlelinkBuilder.asp?" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);

    url += "&handle=" + target + "&context=" + contextId;

    openWidget("articlelinkBuilder", url, { h: 225, w: 600 });
}

function AVinsertArticleContextField(contentName, showBaseURL, showUnsubscribe, addAnalyitcs) {
    var url = CommonPath + "/Widgets/webWidgetBuilder.asp?contentName=" + encodeURIComponent(contentName) + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
    if ((showBaseURL != undefined) && (showBaseURL == true)) {
        url += "&showBaseURL=true";
    }
    if ((showUnsubscribe != undefined) && (showUnsubscribe == true)) {
        url += "&showUnsubscribe=true";
    }
    if ((addAnalyitcs != undefined) && (addAnalyitcs == true)) {
        url += "&addAnalyitcs=true";
    }
    openWidget("webWidgetBuilder", url, { h: 620, w: 600 });
}

function AVinsertArticleField(contentName, showBaseURL, showUnsubscribe, addAnalyitcs) {
    var url = CommonPath + "/Widgets/webWidgetBuilder.asp?contentName=" + encodeURIComponent(contentName) + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);
    if ((showBaseURL != undefined) && (showBaseURL == true)) {
        url += "&showBaseURL=true";
    }
    if ((showUnsubscribe != undefined) && (showUnsubscribe == true)) {
        url += "&showUnsubscribe=true";
    }
    if ((addAnalyitcs != undefined) && (addAnalyitcs == true)) {
        url += "&addAnalyitcs=true";
    }
    openWidget("webWidgetBuilder", url, { h: 620, w: 600 });
}

function AVBIClose( handle, delList )
{
  for( name in delList )
  {
    cBox = document.getElementById( "Enable::Terminate::" + handle + "::Query::ResultMember::" + delList[name] );
    if( cBox )
      cBox.checked = true;
  }
  document.forms[0].submit();
}

function OpenGUIDWidget( imgID, hdl, url )
{
  var args = new Array();
  if( arguments.length == 4 )
  {
    args = arguments[3];
  }
  var img = document.getElementById( imgID );
  var fieldName = imgID.substr( imgID.indexOf( "::" ) + 2 );

  if( img.lastHandle != hdl )
  {
    // toggle menu highlights
    var oldpick = document.getElementById( "MenuItem::" + fieldName + "::" + img.lastHandle );
    if( oldpick )
      oldpick.className = "dr_menuitem";

    var newpick = document.getElementById( "MenuItem::" + fieldName + "::" + hdl );
    if( newpick )
      newpick.className = "dr_menuitem_select";

  }

  if( args[ "type" ] != undefined )
  {

    // reset the desired icon behaviour
    img.setAttribute("lastType", args[ "type" ]);
    img.setAttribute("lastHandle", hdl);
    img.setAttribute("lastURL", url);
  }
  else
  {
    // we've clicked the icon, is it still the same type?
    var attr = img.getAttribute("lastHandle");
    if( hdl != attr )
    {
      hdl = img.getAttribute("lastHandle");
      url = img.getAttribute("lastURL");
    }
  }

  if( img.style.cursor == "not-allowed" )
  {
    // activate the icon for general use
    img.style.cursor = "";
    tsSetEventListener(img, "mousedown", GUIDiconDown);
    tsSetEventListener(img, "mouseout", GUIDiconUp);
    tsSetEventListener(img, "mouseup", GUIDiconUp);
    tsSetEventListener(img, "click", GUIDiconSelect);
  }

  if( document.getElementById( "menu::" + fieldName ).style.display != "none" )
    tsShowButtonMenu( document.getElementById( fieldName + "::Menu" ), fieldName );

  if (hdl != "") {

    var urlTokens = url.split("&");

    if (urlTokens[2].match(sTokenName))
        url = urlTokens[0] + "&" + urlTokens[1] + "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);

  openWidget( hdl, url, args );
}

else {
    var contextType = document.createElement("INPUT");

    var tokens = url.split("=");

    contextType.name = tokens[0];

    contextType.value = tokens[1];

    document.forms[0].appendChild(contextType);

    document.forms[0].submit();
}
}

// helper for dynamic guid pickers
function GUIDiconUp( event )
{
  if( event.srcElement )
    event.srcElement.className = 'iconup';
  else
    event.target.className = 'iconup';
}

// helper for dynamic guid pickers
function GUIDiconDown( event )
{
  if( event.srcElement )
    event.srcElement.className = 'icondown';
  else
    event.target.className = 'icondown';
}

// helper for dynamic guid pickers
function GUIDiconSelect( event )
{
  var obj = event.srcElement ? event.srcElement : event.target;
  OpenGUIDWidget( obj.id, obj.lastHandle, obj.lastURL, { h: 700, w: 800 } );
}
//End of DESKTOP specific only

// big list widget
function openListWidget( elem, handle, botype, prim, basename )
{
  url = CommonPath + "/Widgets/biglist.asp?handle=" + encodeURIComponent( handle );
  url += "&botype=" + encodeURIComponent( botype ) + "&element=" + encodeURIComponent( elem );
  url += "&primitive=" + encodeURIComponent( prim );
  url += "&basename=" + encodeURIComponent( basename );
  url += "&" + encodeURIComponent(sTokenName) + "=" + encodeURIComponent(sToken);

  if( arguments.length == 6 )
    url += "&nomulti=" + encodeURIComponent(arguments[5]);

  openWidget( prim, url, { h: 600, w: 600 } );
}

function openWidget( hdl, url, args )
{
  var widget, shadow;

  if( openWidgets[ hdl ] == undefined )
  {
    widget = document.createElement( "iframe" );
    shadow = document.createElement( "div" );
    widget.id = "Widget::" + hdl;
    widget.name = "Widget::" + hdl;
    widget.className = "widget";
    widget.scrolling = "no";
    widget.border = 0;
    widget.frameborder = 0;
    widget.style.visibility = "hidden";
    widget.src = url;
    shadow.id = "Shadow::" + hdl;
    shadow.className = "drop";
    shadow.style.visibility = "hidden";
    openWidgets[ hdl ] = true;

    document.getElementsByTagName( "body" )[0].appendChild( shadow );
    document.getElementsByTagName( "body" )[0].appendChild( widget );

  }
  else
  {
    widget = document.getElementById( "Widget::" + hdl );
    widget.src = url;
    shadow = document.getElementById( "Shadow::" + hdl );
  }

  var ht = "300px";
  var hdiv = 150;
  if( args[ "h" ] != undefined )
  {
    ht = args[ "h" ] + "px";
    hdiv = Math.round( args[ "h" ] / 2 );
  }

  var wt = "300px";
  var wdiv = 150;
  if( args[ "w" ] != undefined )
  {
    wt = args[ "w" ] + "px";
    wdiv = Math.round( args[ "w" ] / 2 );
  }

  widget.style.height = ht;
  widget.style.width = wt;
  shadow.style.height = ht;
  shadow.style.width = wt;

  // set base values for x & y location of widget parent
  var left = 0;
  var top = 0;
  var left_unit = "px";
  // set the widget pop-up to always be 20% from the top of the viewport
  var top = 15;
  var top_unit = "px";

  if( args[ "x" ] == undefined )
  {
    left = document.body.clientWidth / 2 - wdiv + document.body.scrollLeft;
  }
  else
  {
    left = args[ "x" ];
  }

   if( args[ "y" ] == undefined )
  {
    top = document.body.clientHeight / 2 - hdiv + document.body.scrollTop;
  }
  else
  {
    top = args[ "y" ];
  }

  // Ensure the left of the dialog is displayed in the client area.
  if (left < document.body.scrollLeft)
  {
    left = document.body.scrollLeft;
  }

  if (args["y"] != undefined)
  {
      top = args["y"];
      top_unit = "px";
  }

  widget.style.left = left + left_unit;
  widget.style.top = top + top_unit;

  shadow.style.left = (left + 10) + left_unit;
  shadow.style.top = (top + 1) + top_unit;

  widget.style.visibility = "visible";
  shadow.style.visibility = "visible";

  shadow.style.zIndex = widgetIdx++;
  widget.style.zIndex = widgetIdx++;

//Start ONLINE
  shadow.style.position = "absolute";
  widget.style.position = "absolute";
//End ONLINE

  return true;
}

function openFormWidget( hdl )
{
  var widget, shadow;
  if( openWidgets[ hdl ] == undefined )
  {
    shadow = document.createElement( "div" );

    // Fix for IE bug when trying to dynamically post a form to an iframe created in DOM
    var widget = document.createElement( "span" );
    widget.innerHTML = "<iframe id='Widget::" + hdl + "' name='Widget::" + hdl + "' class='widget' width='100%' height='92%' scrolling='no' style='visibility: hidden' frameBorder='0'>";

    shadow.id = "Shadow::" + hdl;
    shadow.className = "drop";
    shadow.style.visibility = "hidden";
    openWidgets[ hdl ] = true;
    document.getElementsByTagName( "body" )[0].appendChild( shadow );
    document.getElementsByTagName( "body" )[0].appendChild( widget );
  }
  else
  {
    shadow = document.getElementById( "Shadow::" + hdl );
  }
  widget = document.getElementById( "Widget::" + hdl );

  var args = new Array();
  if( arguments.length == 2 )
  {
    args = arguments[1];
  }
  var ht = "300px";
  var hdiv = 150;
  if( args[ "h" ] != undefined )
  {
    ht = args[ "h" ] + "px";
    hdiv = Math.round( args[ "h" ] / 2 );
  }

  var wt = "300px";
  var wdiv = 150;
  if( args[ "w" ] != undefined )
  {
    wt = args[ "w" ] + "px";
    wdiv = Math.round( args[ "w" ] / 2 );
  }

  widget.style.height = ht;
  widget.style.width = wt;
  shadow.style.height = ht;
  shadow.style.width = wt;

  // center this on the window for now
  var left = 0;
  var top = 0;

  if( args[ "x" ] == undefined )
  {
    left = document.body.clientWidth / 2 - wdiv + document.body.scrollLeft;
  }
  else
  {
    left = args[ "x" ];
  }

  if( args[ "y" ] == undefined )
  {
    top = document.body.clientHeight / 2 - hdiv + document.body.scrollTop;
  }
  else
  {
    top = args[ "y" ];
  }

  widget.style.left = left;
  widget.style.top = top;

  shadow.style.left = left + 10;
  shadow.style.top = top + 10;

  shadow.style.zIndex = widgetIdx++;
  widget.style.zIndex = widgetIdx++;

  widget.style.visibility = "visible";
  shadow.style.visibility = "visible";

  return true;
}
//End of DESKTOP specific only

function closeWidget( hdl, inMsg )
{
    var elemW = document.getElementById( "Widget::" + hdl );
    var elemS = document.getElementById( "Shadow::" + hdl );

    if(elemW && elemS)
    {
        if( hdl == "summarywidget" ||  hdl == "extractwidget")
        {
            elemW.style.display = "none";
	    elemS.style.display = "none";
        }
        else
        {
	    elemW.style.visibility = "hidden";
	    elemS.style.visibility = "hidden";
        }
        window.focus();

        if( inMsg != null && inMsg != "" )
        {
	    AValert( inMsg );
        }
    }
}

/*
* doAction :: applicable only for search based widget [upsell Feature, add-on Feature]
*
* index -> actionIndex :: to conclude what action to be taken; based on the parent page
* id -> context_id (not the article_id) :: some situation, we need to pass the
*          context_id to the parent page in order to make it work;
* doAction is based on CancelCall
*/
function doAction(index, id) {
    //alert('doAction : index : ' + index + ', id: ' + id);

    switch (index)
    {
        case 0: //misc item : upsell cancel call
            submitMiscItems(id);
            break;
        case 1: //gifts : upsell cancel call
            submitGifts(id);
            break;
        case 2: //bundles : upsell cancel call
            plainSubmit(id);
            break;
        case 4: //Performances: seatSearch.asp : direct link submit
            tsSelectDirectLink(urlToBeSubmitted);
            break;
        case 5: //Performances: seatSearch.asp : Map Select Button Click
            tsSelectMapDefault();
            break;
        case 6: //Performances: seatSearch.asp : Best Available Button Click
            tsSelectBestAvailableDefault();
            break;
        case 7: //Stored Value Items:
            addSelectedValueItem();
            break;
        default: //default applicable for links in orderSummary.asp ; applicable for all
            // do nothing
    }
}

/*
function doActionOld(index, id) {

    alert('doAction : index : ' +index+', id: '+id );
    switch(index)
    {
        case 0: //direct link selection from seatSearch.asp
            SubmitForm(urlToBeSubmitted);
            break;
        case 1: //'Map Select' from seatSearch.asp [caller id 8 : upsell call]
            tsSelectMapWhenWidgetCancelled(8, id);
            break;
        case 2: //direct link selection from bundleSelect.asp
            submitFormWhenWidgetsCancelled(id);
            break;
        case 3: //direct link selection from miscItemSearch.asp
            submitLocalForm(id); //context_id is getting passed
            break;
        case 4: //addToOrder button click from giftSearch.asp [upsell final call]
            tsAddToOrderDefault(id); //context_id is getting passed
            break;
        case 5: //'Map Select' from seatSearch.asp [caller id 16 : addon call]
            tsSelectMapWhenWidgetCancelled(16);
            break;
        case 6: //'Best Available' from seatSearch.asp [caller id 8 : upsell call]
            tsSelectBestAvailableWhenWidgetsCancelled(8);
            break;
        case 7: //'Best Available' from seatSearch.asp [caller id 16 : addon call]
            tsSelectBestAvailableWhenWidgetsCancelled(16);
            break;
        case 8: //'Direct Link' clicking when the user cancel the widget from seatSearch.asp [caller id 8: upsell call]
            tsSelectDirectLinkWhenWidgetsCancelled(urlToBeSubmitted, performanceIdToBeSubmitted, 8);
            break;
        case 9: //'Direct Link' clicking when the user cancel the widget [caller id 16: addon call]
            tsSelectDirectLinkWhenWidgetsCancelled(urlToBeSubmitted, performanceIdToBeSubmitted, 16);
            break;
        case 10: //direct link selection from miscItemSearch.asp [caller id 8 : upsell call]
            //alert('arguments[2] : ' + arguments[2]);
            submitLocalForm(id, 8, arguments[2]); //context_id is getting passed
            break;
        case 11: //direct link selection from miscItemSearch.asp [caller id 16: addon call]
            submitLocalForm(id, 16, ''); //context_id is getting passed ; empty must be provided
            break;
        case 12: //radio buttno submit from giftsSearch.asp [caller id 8 : upsell call]
            //alert('arguments[2] : ' + arguments[2]);
            submitLocalForm(id, 8, arguments[2]); //context_id is getting passed
            break;
        case 13: //radio buttno submit from giftsSearch.asp [caller id 16 : upsell call]
            submitLocalForm(id, 16, ''); //context_id is getting passed
            break;
        case 14: //addToOrder button click from giftSearch.asp [caller id 8 : upsell call]
            submitLocalForm(id, 8, arguments[2]); //context_id is getting passed
            break;
        case 15: //addToOrder button click from giftSearch.asp [ call]
            tsAddToOrderDefault();
            break;
        case 16: //Direct Link click from bundleSelect.asp [ caller id 8: upsell call ]
            //alert('16 here');
            submitBundles(id, 8, arguments[2]);
            break;
        case 17: //Direct Link click from bundleSelect.asp [ caller id 16: addon call ]
            submitBundles(id, 16 );
            break;
        default: //default applicable for links in orderSummary.asp
                // do nothing
    }
}
*/

function resizeWidget( hdl, ht, wd )
{
  var widget = document.getElementById( "Widget::" + hdl );
  var shadow = document.getElementById( "Shadow::" + hdl );

  if( widget && shadow )
  {
    widget.style.height = ht + "px";
    shadow.style.height = ht + "px";
    widget.style.width = wd + "px";
    shadow.style.width = wd + "px";
  }
}

function applyWidget( hdl, inMsg, frmIdx )
{
  closeWidget( hdl, inMsg );

  var formTarget = 0;
  if( frmIdx != null )
  {
    formTarget = frmIdx;
  }

  var notifyElem = document.createElement( "INPUT" );
  notifyElem.type = "hidden";
  notifyElem.name = "tsAttachNotify";
  notifyElem.value = "1";
  document.forms[ formTarget ].appendChild( notifyElem );

  if( ++submitCount == 1 )
    document.forms[ formTarget ].submit();
}


/*
 *  Widget drag functions
 */

var widgetdragger = null;
var shadowdragger = null;

var widgetdragX = 0;
var widgetdragY = 0;
var widgetstartX = 0;
var widgetstartY = 0;

function startWidgetDrag( hdl, mouseX, mouseY )
{
  widgetdragger = document.getElementById( 'Widget::' + hdl );
  shadowdragger = document.getElementById( 'Shadow::' + hdl );

  if( shadowdragger )
    shadowdragger.style.zIndex = widgetIdx++;

  widgetdragger.style.zIndex = widgetIdx++;

  widgetdragX = parseInt( widgetdragger.style.left );
  widgetdragY = parseInt( widgetdragger.style.top );
  widgetstartX = mouseX;
  widgetstartY = mouseY;
}

function stopWidgetDrag()
{
  widgetdragger = null;
  shadowdragger = null;
}

function moveWidget( offsetX, offsetY )
{
  if( ( widgetdragX + offsetX < 0 ) || ( widgetdragY + offsetY ) < 0 )
  {
    return;
  }

  if( widgetdragger != null )
  {
    try
    {
      widgetdragger.style.left = ( widgetdragX + offsetX ) + "px";
      widgetdragger.style.top  = ( widgetdragY + offsetY ) + "px";

      if( shadowdragger )
      {
        shadowdragger.style.left = ( widgetdragX + offsetX + 10 ) + "px";
        shadowdragger.style.top  = ( widgetdragY + offsetY + 10 ) + "px";
      }
    }
    catch( e )
    {
    }
  }
}
