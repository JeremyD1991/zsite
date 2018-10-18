/*
  online-jscript.js
  Description: Support methods and objects for client-side activities stripped down for online sales
*/

var tsCalHdl;
var tsWinHdl = new Array();
var tsDurHdl;
var tsErrorDialogHdl;
var isDesktop = false;

if( CommonPath == undefined )
{
  var CommonPath = "../Common";
}

/*
  *****************************************************
  ComboBox methods
  *****************************************************
*/

function tsSelectField( evt, key )
{
  document.getElementById( key + "::text" ).select();
}

function tsValueFromText( evt, key )
{
  var popup = document.getElementById( key + "::select" );
	var textfield = document.getElementById( key + "::text" );

	var idx;
  togglePlaceHolder(textfield.value, key);
	for(idx=0; idx < popup.options.length; idx++)
  {
		if( popup.options[idx].text == textfield.value )
    {
			popup.selectedIndex = idx;
			return;
		}
	}

	popup.selectedIndex = -1;
}

/*
 * tsCompleteTyping: function called to auto complete the item by the support of Select option
 *
 * There will be combo which is included textbox and select option;
 *
 * whenever the user types a letter in the textbox, it will search
 * for the matching words (which is available in the select option)
 * Eg: when you type 1, it will bring 10, 100 (if 10 & 100 available in the select option)
 *     when you type C, it will bring Canada, Cambodia (if Canada & Cambodia available in the select option)
 *
 * param :: disableAutoComplete - to disable auto complete and keep the letters whatever the user types
 *   disableAutoComplete::null - user is not aware of disableAutoComplete param is available or not;
 *   disableAutoComplete::undefined - user is not aware of disableAutoComplete param is available or not;
 *   disableAutoComplete::true - user is aware of disableAutoComplete param and (s)he wants it
 *   disableAutoComplete::false - user is aware of disableAutoComplete param and (s)he doesn't want it
 *
 * note: even if the user doesn't pass the 'disableAutoComplete' param, it will continue to work
 */
function tsCompleteTyping( evt, key , disableAutoComplete) {
  if(evt.which && evt.which < 0x2f && evt.which != 0x20)
    return;
	else if(evt.keyCode && evt.keyCode < 0x2f && evt.keyCode != 0x20)
		return;

	var textfield = document.getElementById( key + "::text" );

	var text = textfield.value;
	var popup = document.getElementById(key + "::select");
	togglePlaceHolder(text, key)
  // Only IE understands the text selection mechanism this function is doing, so we'll
  // exit if it's any other browser (which is evidenced from the lack of
  // the createTextRange method on the element.
  if(!textfield.createTextRange)
    return;

  var text = textfield.value;
	var popup = document.getElementById( key + "::select" );

	var options = popup.options;
	var i;
	var utext = text.toUpperCase();

	for( i=0; i < options.length; i++ )
  {
		var newtxt = options[i].text;
		var uopt = newtxt.toUpperCase();

		if (disableAutoComplete) { // check the for condition whether disableAutoComplete is true
		    if (uopt == utext) {
		        tsValueFromText(evt, key);
		        break;
		    }
		} else { // when disableAutoComplete is not true or not available
		    if (uopt != utext && uopt.indexOf(utext) == 0) {
		        var txtrange = textfield.createTextRange();
		        textfield.value = text + newtxt.substr(text.length);
		        txtrange.moveStart("character", text.length);
		        txtrange.select();
		        tsValueFromText(evt, key);
		        break;
		    }
		}
	}
}

function tsToggleChildFilter(event, id)
 {
	var expandImg;
	if (event.target) {
        expandImg = event.target;
    }
    else {
        expandImg = event.srcElement;
    }
	var elem = document.getElementById(id);
	if(elem.style.display == "none")
	{
		elem.style.display = "block";
		expandImg.src = "/Images/cminus.gif";
	}
	else
	{
		elem.style.display = "none";
		expandImg.src = "/Images/cplus.gif";
	}
 }

function tsTestValue( evt, key )
{
	var textfield = document.getElementById( key + "::text" );
  var text = textfield.value;
	var popup = document.getElementById( key + "::select" );
	togglePlaceHolder(text, key)
	var options = popup.options;
	var i;
	var utext = text.toUpperCase();

	for( i=0; i < options.length; i++ )
  {
		var newtxt = options[i].text;
		var uopt = newtxt.toUpperCase();
		if( uopt == utext )
    {
      textfield.value = newtxt;
			break;
		}
	}
}

function tsTextKeyDown( evt, key )
{
  var popup = document.getElementById( key + "::select" );
  var whichKey = evt.which ? evt.which : evt.keyCode;

	// Down Arrow
	if( whichKey == 40)
  {
		if( popup.selectedIndex < popup.options.length - 1 )
    {
			popup.selectedIndex += 1;
    }
		tsSetFromPopup( evt, key );
	}

	// Up Arrow
	if( whichKey == 38 )
  {
		if( popup.selectedIndex > 0 )
    {
			popup.selectedIndex -= 1;
    }
		else if( popup.selectedIndex == -1 )
    {
			popup.selectedIndex = popup.options.length - 1;
    }
		tsSetFromPopup( evt, key );
	}
}

function togglePlaceHolder(text, key) {
    var id = key + "::placeHolder";
	if (document.getElementById(id))
	{
		if (text !== "") {
			document.getElementById(id).style.visibility = 'hidden';
		}
		else {
			document.getElementById(id).style.visibility = 'visible';
		}
	}
}
function setFocusTextField(key) {
    textfield = document.getElementById(key + "::text");
    textfield.focus();
    textfield.select();
}
function tsSetFromPopup( evt, key )
{
  var popup = document.getElementById( key + "::select" );
  var textfield = document.getElementById( key + "::text" );

  var idx = popup.selectedIndex;
  togglePlaceHolder(popup.value, key)

	if( idx != null && idx >= 0 )
  {
		textfield.value = popup.options[idx].text;
	}

	if( popup.needsblur == 1 )
  {
		textfield.focus();
		textfield.select();
	}

}

function tsShiftToText( evt, key )
{
  var popup = document.getElementById( key + "::select" );
  var textfield = document.getElementById( key + "::text" );

  if( popup.isClicked == 1 )
  {
    popup.isClicked = 0;
		if( popup.needsblur == 1 )
    {
  		textfield.focus();
	  	textfield.select();
	  }
  }
  else
  {
    popup.isClicked = 1;
  }
}

function tsPopupFocus( evt, key )
{
  var popup = document.getElementById( key + "::select" );
	popup.needsblur = 1;
}

function tsPopupBlur( evt, key )
{
  var popup = document.getElementById( key + "::select" );
  var textfield = document.getElementById( key + "::text" );

  var idx = popup.selectedIndex;
  if( idx != null && idx == 0 )
  {
		textfield.value = popup.options[idx].text;
	}

	popup.needsblur = 0;
  popup.isClicked = 0;
}

/*
  *****************************************************
  Chooser methods
  *****************************************************
*/

function tsChooserClick( fromElem, toElem, hiddenElem, addItem )
{
  var fromBox = document.getElementById( fromElem );
  var toBox = document.getElementById( toElem );
  var hiddenLoc = fromBox.form;

  // move the nodes
  for( var x = fromBox.options.length - 1; x >= 0; x-- )
  {
    if( fromBox.options(x).selected )
    {
      var tmpNode = fromBox.removeChild( fromBox.options(x) );
      toBox.appendChild( tmpNode );
      tmpNode.selected = false;

      if( addItem )
      {
        // create a new hidden element
        var tmpElem = document.createElement("input");
        tmpElem.type = "hidden";
        tmpElem.name = hiddenElem;
        tmpElem.value = tmpNode.value;
        hiddenLoc.appendChild( tmpElem );
      }
      else
      {
        // get the elements and find the one that should be removed
        var elems = document.getElementsByName( hiddenElem );
        for( var y = 0; y < elems.length; y++ )
        {
          if( elems[y].value == tmpNode.value )
          {
            elems[y].parentElement.removeChild( elems[y] );
          }
        }
      }
    }
  }
}

/*
  *****************************************************
  Date Range methods
  *****************************************************
*/
function tsSetTimeValue( IDidx, elemName )
{

  var hrSel = document.getElementsByName( "hours::" + elemName + "::" + IDidx );
  var minSel = document.getElementsByName( "minutes::" + elemName + "::" + IDidx );
  var timeField = document.getElementsByName( elemName + "::" + IDidx );

  hrs = hrSel[0].options[ hrSel[0].selectedIndex ].value;
  mins = minSel[0].options[ minSel[0].selectedIndex ].value;

  if( hrs == "" || mins == "" )
  {
    // insufficient to set new
    timeField[0].value = "";
    return;
  }
  timeField[0].value = hrs + ":" + mins + ":00";
}

/*
  *****************************************************
  Tab Panel methods
  *****************************************************
*/

// called when the page unloads
function PageUnload()
{
  try
  {
    LocalPageUnload();
  }
  catch( e )
  {
    // ignore, the page doesn't have it
  }
}

// use to enable/disable the selected node state
function tsToggleNodeState( inCheck )
{
  document.getElementById( "Disable::" + inCheck.name ).disabled = inCheck.checked;
}

// used by delete boxes to disable form elements related to it
function TSdisableChildren( inCheck )
{

  try
  {
    if( !tsLocalDisable( inCheck ) )
    {
      inCheck.checked = false;
      return;
    }
  }
  catch( e )
  {
    // ignore
  }

  // get any other elements matching "Disable::" + checkname
  var inputElements = document.getElementsByTagName("input");
  for (var i = 0; i < inputElements.length; i++)
  {
    if (inputElements[i].getAttribute("id") == "Disable::" + inCheck.name)
    {
      inputElements[i].disabled = inCheck.checked;
    }
  }

  try
  {
    tsLocalEndDisable( inCheck );
  }
  catch( e )
  {
    // ignore
  }
}

// returns the real value of a form element
function GetRealValue( frmElement )
{
  if( frmElement.selectedIndex == undefined )
  {
    return frmElement.value;
  }
  else
  {
    // select list
    return frmElement.options[ frmElement.selectedIndex ].value;
  }
}

// sets a form element value
function SetRealValue( frmElement, inVal )
{
  if( frmElement.selectedIndex == undefined )
  {
    frmElement.value = inVal;
  }
  else
  {
    // select list
    for( var x = 0; x < frmElement.options.length; x++ )
    {
      if( frmElement.options[x].value == inVal )
      {
        frmElement.selectedIndex = x;
        break;
      }
    }
  }
}

// toggle the display mode of an HTML object
function tsToggleDisplay( idArr )
{
  for( var x = 0; x < idArr.length; x++ )
  {
    try
    {
      var toggleObj = document.getElementById( idArr[x] );
      if( toggleObj.style.display == 'none' )
      {
        toggleObj.style.display = 'block';
      }
      else
      {
        toggleObj.style.display = 'none';
      }
    }
    catch( e )
    {
      // ignore, not found or not supported
    }
  }
}


function highlightrow( elem, classRef )
{
  elem.className = classRef;
}


/*
 *
 * Widget Prep Functions
 *
 */






//

function tsSetMailLink( elem )
{
  link = document.getElementById( "mail::" + elem.id );
  if( elem.value == "" )
  {
    link.onclick = returnFalse;
    link.href = "mailto:";
    link.className = "nocursor emailIcon";
  }
  else
  {
    link.href = "mailto:" + elem.value;
    link.onclick = returnTrue;
    link.className = "emailIcon";
  }
}

function returnTrue()
{
  return true;
}

function returnFalse()
{
  return false;
}

function tsToggleIconClass( elem, css )
{
  if( elem.className != "iconno" )
  {
    elem.className = css;
  }
}

// disables submit buttons automatically when inserts/updates called
function disableSubmitButton( elem )
{
  elem.disabled = true;
  elem.form.elements[ 'doWorkReal::' + elem.name ].name = elem.name;
  elem.form.submit();
}

/*
 * Page Timers for on offer stuff, etc.
 */

var tsTimeStart = 0; // time remaining in seconds
var expMsgFlag = false;

/**
 *
 */
function tsSeedTimer()
{
  if( document.getElementById ) // IE5, NS6
  {
    tsTimerDisplayHandle = document.getElementById( "tsTimerDisplay" );
    tsOfferExpiredHandle = document.getElementById( "tsOfferExpired" );
    tsTimerIdHandle = document.getElementById( "tsTimerId" );
    tsTimerMessageHandle = document.getElementById( "tsTimerMessage" );
  }
  else if( document.all ) // IE4
  {
    tsTimerDisplayHandle = document.all[ "tsTimerDisplay" ];
    tsOfferExpiredHandle = document.all[ "tsOfferExpired" ];
    tsTimerIdHandle = document.all[ "tsTimerId" ];
    tsTimerMessageHandle = document.all[ "tsTimerMessage" ];
  }
  else if ( document.layers ) // NS4
  {
    tsTimerDisplayHandle = document.layers[ "tsTimerDisplay" ];
    tsOfferExpiredHandle = document.layers[ "tsOfferExpired" ];
    tsTimerIdHandle = document.layers[ "tsTimerId" ];
    tsTimerMessageHandle = document.layers[ "tsTimerMessage" ];
  }

  if( tsTimeStart < 0 || tsTimerDisplayHandle == null )
  {
    var expiredText = offerExpired;
    var expiredMessage = admissionsExpired;
    tsTimerDisplayHandle.innerHTML = "";
    tsOfferExpiredHandle.innerHTML = expiredText;
    tsTimerMessageHandle.innerHTML = "";
    expMsgFlag = true;
  }

  if( !expMsgFlag )
  {
    if( document.getElementById || document.all )
    {
      tsTimerDisplayHandle.innerHTML = tsTimeStr( tsTimeStart );
    }
    else if( document.layers )
    {
      text = '<p class="offerTimeout">' + tsTimeStr( tsTimeStart ) + '</p>';
  		tsTimerDisplayHandle.document.open();
  		tsTimerDisplayHandle.document.write( text );
  		tsTimerDisplayHandle.document.close();
    }
    tsTimeStart--;
    tsTimerIdHandle.value = setTimeout( "tsSeedTimer()", 1000 );
  }
}

function tsClearTimer()
{
  if( document.getElementById ) // IE5, NS6
  {
    tsTimerIdHandle = document.getElementById( "tsTimerId" );
  }
  else if( document.all ) // IE4
  {
    tsTimerIdHandle = document.all[ "tsTimerId" ];
  }
  else if ( document.layers ) // NS4
  {
    tsTimerIdHandle = document.layers[ "tsTimerId" ];
  }

  if ( tsTimerIdHandle )
  {
    clearTimeout( tsTimerIdHandle.value );
  }
}

/**
 *
 */
function tsTimeStr( seconds )
{
  hrs = new String( Math.floor( seconds / 3600 ) );
  leftover = seconds % 3600;
  mins = new String( Math.floor( leftover / 60 ) );
  secs = new String( leftover % 60 );

  hrs = hrs.length > 1 ? hrs : "0" + hrs;
  mins = mins.length == 2 ? mins : "0" + mins;
  secs = secs.length == 2 ? secs : "0" + secs;

  if (hrs != "00")
  {
    return hrs + ":" + mins + ":" + secs
  }
  else
  {
    return mins + ":" + secs
  }
}

/**
 *
 */
function displayOnOfferTimeout()
{
  if( document.getElementById( "tsTime" ) )
  {
    tsTimeStart = document.getElementById( "tsTime" ).innerHTML;
    var tsTimeStatus = tsTimeStr( tsTimeStart );
    tsSeedTimer();
  }
}


/**
 *
 */
var openWindows = new Array();
openWindows[ "baseWindow" ] = "";

function WindowPop( windowName, url, h, w )
{
  w = (w) ? w : "320"; // set default if width not specified
  h = (h) ? h : "240"; // set default if height not specified

  // see if we have the window open already
  if( openWindows[ windowName ] != null && !openWindows[ windowName ].closed )
  {
    openWindows[ windowName ].focus();
  }
  else
  {
    var x = 0;
    var y = 0;
    if ( document.all || document.layers )
    {
      x = ( screen.availWidth - w ) / 2;
      y = ( screen.availHeight - h ) / 2;
    }

    winArgs = "height = " + h + ",width = " + w + ", top = " + y + ", left " + x + ", status = 1, dependent = 1";

    var moreWinArgs = "";
    if( windowName != "Help" )
    {
      moreWinArgs = ", scrollbars = 1, resizable = 1, toolbar = 1";
    }

    winHdl = window.open( url, windowName, winArgs + moreWinArgs );
    winHdl.focus();
    openWindows[ windowName ] = winHdl;
  }
}


/**
 *
 */
function closeChildren()
{
  for( x in openWindows )
  {
    try
    {
      openWindows[x].close();
    }
    catch( e )
    {
      // ignore, the window is already closed
    }
  }
}


/**
 *
 */
function loadUrl( url )
{
  if( url )
  {
    new showConfirmPopup( '', genericConfirmationMessage, function () { document.location = url }, '' );
  }
}


/**
 *
 */
function jumpTo( url )
{
  if( url )
  {
    document.location = url;
  }
}

/**
 *
 */
function checkout( elem )
{
  elem.form.elements[ "doWork::WSorder::insert" ].value = "Buy";
  elem.className = "btn_off";
  elem.disabled = true;
  elem.form.submit();
}

/**
 *
 */
function recalculate( elem )
{
  elem.form.action = "shoppingCart.asp";
  elem.form.submit();
}

/**
 *
 */
function addGiftCert( elem )
{
  elem.form.action = "shoppingCart.asp?AddGiftCert";
  elem.form.submit();
}

/**
 *
 */
function addDonation( elem )
{
  elem.form.action = "shoppingCart.asp?AddDonation";
  elem.form.submit();
}

/**
 *
 */
function logon( elem, nextPage )
{
  if( elem.form.elements[ "callback" ] && nextPage )
  {
    elem.form.elements[ "callback" ].value = nextPage;
  }

  elem.form.action = "doLogin.asp";
  elem.form.submit();
}

/**
 *
 */
function newUser( elem, nextPage )
{
  if( elem.form.elements[ "callback" ] && nextPage )
  {
    elem.form.elements[ "callback" ].value = nextPage;
  }

  elem.form.action = "createAccount.asp";
  elem.form.submit();
}

/**
 *
 */
function setDelItem( elem, page, id )
{
  if( elem && page && id )
  {
    elem.form.action = page;
    tsDel = document.getElementById( "tsDelete" )
    tsDel.name = id;
  }
}

/**
 *
 */
var tsAllowSubmit = true;
var submitCalled = false;

function SubmitForm( inURL )
{
  frmIdx = 0;
  if( arguments.length == 2 )
    frmIdx = arguments[1];

  if( tsAllowSubmit )
  {
    if( !submitCalled )
    {
      var tmpData = inURL.split( "?", 2 );
      document.forms[ frmIdx ].action = tmpData[0];

      // build hidden elements on the node
      if( tmpData.length == 2 )
      {
        var tmpElems = tmpData[1].split( "&" );
        for( var x = 0; x < tmpElems.length; x++ )
        {
          var chldData = tmpElems[x].split( "=", 2 );
          var chldElem = document.createElement( "INPUT" );
          chldElem.type = "hidden";
          chldElem.name = decodeURIComponent(chldData[0]);
          chldElem.value = decodeURIComponent(chldData[1]);
          document.forms[frmIdx].appendChild(chldElem);
        }
      }

      // call a default method on the local form page
      try
      {
        LocalFormSubmit();
      }
      catch( e )
      {
        // ignore, the page doesn't have it
      }

      submitCalled = true;
    }

    document.forms[ frmIdx ].submit();
  }
}


function downLoadTickets( url )
{
    var downloadFrame = document.getElementById('downLoadTickets_id');
    if(downloadFrame != null)
        downloadFrame.parentNode.removeChild(downloadFrame);

  widget = document.createElement( "iframe" );
    widget.id = 'downLoadTickets_id';
  widget.style.height = "0px";
  widget.style.width = "0px";
  document.body.appendChild( widget );
  widget.src = url;
}

/*
 * Handle management of multis as plain text input fields.
*/
function tsAddMultiField( evt, maxSize, returnAfter )
{
  var elem = null;
  if( evt.target )
  {
  	elem = evt.target;
  }
  else
  {
    elem = evt.srcElement;
  }
  elem.style.display = "none";

  var testIndex = elem.id.indexOf( "::" );
  var curID = elem.id.substr( testIndex + 2 );
  tsCreateInputElement(document.getElementById(curID), returnAfter,  maxSize);
}

function tsAddInputItem( evt, elem, returnAfter )
{

  // don't if current is blank
  if( elem.value == "" )
  {
    return true;
  }

  var code = 0;
  var isCtl = false;
  try
  {
    code = evt.keyCode;
    isCtl = evt.ctrlKey;
  }
  catch( e )
  {
    try
    {
      // mozilla event handler
      code = evt.which;
      isCtl = evt.modifiers == "CONTROL_MASK" ? true : false;
    }
    catch( e )
    {
      // nada
      return true;
    }
  }

  // needs to be a CTL-TAB sequence
  if( code != 9 || !isCtl )
  {
    return true;
  }

  // don't if current is blank
  if( elem.value == "" )
  {
    if(evt.stopPropagation)
    {
      evt.stopPropagation();
      evt.preventDefault();
    }
    else
    {
      evt.cancelBubble = true;
    }
    evt.returnValue = false;
    return false;
  }

  var addMultiElem = document.getElementById( "add_multi::" + elem.id );
  addMultiElem.style.display = "none";
  tsCreateInputElement(elem,returnAfter);

  if(evt.stopPropagation)
  {
    evt.stopPropagation();
    evt.preventDefault();
  }
  else
  {
    evt.cancelBubble = true;
  }
  evt.returnValue = false;
  return false;
}

function tsCreateInputElement(elem, returnAfter, maxSize)
{
  var $this = $(elem);
  var testIdx = $this.attr('id').lastIndexOf( "::" );
  var curIdx = parseInt( $this.attr('id').substr( testIdx + 2 ) ) + 1;
  var curID =  $this.attr('id').substring( 0, testIdx );

  var insertCt = $( document.getElementById(curID + "::insert") );

  // Check to see if element is inside an input-group div
  var inputGroup = $this.parent().hasClass("input-group");

  var valCount = $( document.getElementById( curID + "::count" ) );
  currentCount = parseInt( valCount.attr('value') );

  if( currentCount != curIdx )
    return;

  if(!insertCt.hasClass('multidata')){
    insertCt = insertCt.find('.multidata');
  }

  // If it's inside input-group, close the input-group, otherwise, clone the input itself
  var $newElem = inputGroup ? $this.parent().clone() : $this.clone();
  insertCt.append($newElem);

  if(inputGroup){
    // Update the various ID, including the various buttons inside input-group-addon

    $newElem.children().each(function(){
      var elemID = $(this).attr('id');
      if(elemID){
        var idx = elemID.lastIndexOf( "::" );
        $(this).attr('id', elemID.substring( 0, idx ) + "::" + currentCount);
      }

      // Clear the value inside the input since we're cloning the element
      $(this).val('');
    });

    var $addOn = $newElem.find(".input-group-addon");

    $addOn.children().each(function(){
      var elemID = $(this).attr('id');
      if(elemID){
        var idx = elemID.lastIndexOf( "::" );
        $(this).attr('id', elemID.substring( 0, idx ) + "::" + currentCount);
      }

      var elemClick = $(this).attr('onclick');
      if(elemClick){
        elemClick = elemClick.replace("::" + (valCount.attr('value')-1), "::" + currentCount);
        $(this).attr('onclick', elemClick);
      }
    });

    if (currentCount + 1 < maxSize){
      $newElem.find(".addMultiIcon").show();
    }

    $newElem.find("input").focus();

  }else{
    // If it's input only, then update the element's id only
    $newElem.attr('id', curID + "::" + currentCount);
    $newElem.focus();

    if (currentCount + 1 < maxSize){
      var addIcon = $newElem.parent().find(".addMultiIcon");
      addIcon.insertAfter($newElem);
      addIcon.show();
    }

    var elemID = addIcon.attr('id');
    if(elemID){
      var idx = elemID.lastIndexOf( "::" );
      addIcon.attr('id', elemID.substring( 0, idx ) + "::" + currentCount);
    }

    // Clear the value inside the input since we're cloning the element
    $newElem.val('');
  }

  // Update the count in the hidden object
  valCount.attr('value', currentCount + 1);
}



function disablePromoText(select, input)
{
  // disable the input if there's a promo code selected in the combo box
  if(select && input)
    input.disabled = (select.value != "") ? true : false;
}

// Create a hidden form element correctly
function tsCreateHidden(name, value)
{
  var elem = document.createElement("input");
  elem.type = "hidden";
  elem.name = name;
  elem.value = value;
  return elem;
}

// Create <div> element with the given className (optional)
function tsCreateDiv(className)
{
    var elem = document.createElement("div");
    if (className) {
        elem.className = className;
    }
    return elem;
}

// Create <h2> heading with the given title
function tsCreateHeading(title)
{
    var heading = document.createElement("h3");
    heading.appendChild(tsCreateText(title));
    return heading;
}

// Create <form> element with the given action
function tsCreateForm(action)
{
    var form = document.createElement("form");
    if (action) {
        form.setAttribute("action", action);
    }
    form.setAttribute("method", "post");
    return form;
}

function tsCreateInputText(name, value, size)
{
    var elem = document.createElement("input");
    elem.type = "text";
    elem.name = name;
    elem.value = value;
    if (size) {
        elem.size = size;
    }
    return elem;
}

function tsCreateInputPassword(name, size) {
    var elem = document.createElement("input");
    elem.type = "password";
    elem.name = name;
    elem.autocomplete = "off";
    if (size) {
        elem.size = size;
    }
    return elem;
}

function tsCreateSubmit(name, value, className)
{
    var elem = document.createElement("input");
    elem.type = "submit";
    elem.name = name;
    elem.value = value;
    if (className) {
        elem.className = className;
    }
    return elem;
}

// Create <table> element with the given className (optional)
function tsCreateTable(className)
{
    var elem = document.createElement("table");
    if (className) {
        elem.className = className;
    }
    return elem;
}

// Create <tr> element with the given className (optional)
function tsCreateTableRow(className)
{
    var tr = document.createElement("tr");
    if (className) {
        //tr.setAttribute("class", className);
        tr.className = className; // setAttribute is avoided for IE-9-C issue : AVT-5884
    }
    return tr;
}

var NBSP = "\u00a0";

// Creates a text node containing &nbsp;
function tsCreateNBSP()
{
    return document.createTextNode(NBSP);
}

// Create <th> element with the given title (required) and className (optional)
function tsCreateTableHeader(title, className)
{
    var elem = document.createElement("th");
    elem.appendChild(document.createTextNode(title));

    if (title && title !== NBSP) {
        elem.setAttribute("title", title);
    }

    if (className) {
        elem.setAttribute("class", className);
    }

    return elem;
}

// Create <td> element with the given className (optional)
function tsCreateTableCell(className)
{
    var td = document.createElement("td");

    if (className) {
        td.setAttribute("class", className);
    }

    return td;
}

// Create a text element
function tsCreateText(text)
{
    return document.createTextNode(text);
}

// Create a <p> element with the given text and className
function tsCreateParagraph(text, className) {

    var elem = document.createElement("p");

    if (text) {
        elem.appendChild(document.createTextNode(text));
    }

    if (className) {
        elem.className = className;
    }
    return elem;
}

// Create <span> element with the given text (required) and className (optional)
function tsCreateSpan(text, className)
{
    var span = document.createElement("span");
    if (text) {
        span.innerHTML = text;
    }
    if (className) {
        span.className = className;
    }
    return span;
}

// Create <a> element with the given url (required) and title (optional)
function tsCreateLink(url, title, className)
{
    var elem = document.createElement("a");
    if(url != "")
    {
        elem.href = url;
    }

    if (title) {
        elem.title = title;
        elem.appendChild(document.createTextNode(title));
    }
    if (className) {
        elem.setAttribute("class", className);
    }
    
    // make sure element can be accessed via the Tab key
    elem.setAttribute("tabindex", "0");
    
    // on pressing the Enter key, trigger a click event
    elem.addEventListener("keydown", function(event) {
      if (event.keyCode == 13) {
          event.preventDefault();
          this.click();
      }
    });
    
    return elem;
}

// Create <img> element with the given src (required), alt (optional), and className (optional)
function tsCreateImage(src, alt, className)
{
    var img = document.createElement("img");
    img.src = src;

    if (alt) {
        img.alt = alt;
    }

    if (className) {
        img.className = className;
    }

    return img;
}

// Creates <ul> element
function tsCreateList(className) {
    var elem = document.createElement("ul");
    if (className) {
        elem.className = className;
    }
    return elem;
}

// Create <li> element with the given className (optional)
function tsCreateListItem(className)
{
    var elem = document.createElement("li");
    if (className) {
        elem.className = className;
    }
    return elem;
}


function tsAddLoadEvent(func)
{
    if (window.addEventListener) {
        window.addEventListener("load", func, false);
    }
    else if (window.attachEvent) {
        window.attachEvent("onload", func);
    }
    else { // fallback
        var old = window.onload;
        window.onload = function () {
            if (old) old();
            func();
        };
    }
}

// Loads the JavaScript file asynchronously
function tsLoadScript(src)
{
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    head.appendChild(script);
}

/* Append url2 to url1 location */
function tsBuildLink(url1, url2) {
    if (url1.charAt(url1.length - 1) == "/" && url2.charAt(0) == "/") return url1 + url2.substr(1);
    else if (url1.charAt(url1.length - 1) != "/" && url2.charAt(0) != "/") return url1 + "/" + url2;
    else return url1 + url2;
}

var lightBoxCount = 0;

function lightBoxOn()
{
    lightBoxCount++;
    if (lightBoxCount > 1)
    {
        return;
    }

    if( document.getElementById('fade') )
    {
        document.getElementById('fade').style.display = 'block';
    }

    // Get the height of the page content
    var pageHeight = document.getElementById('onlineBody') ? document.getElementById('onlineBody').offsetHeight : 0;

    // Get the height of the browser
    var browserHeight;
    if( typeof( window.innerHeight ) == 'number' )
    {
        //Non-IE
        browserHeight = window.innerHeight;
        pageHeight += 20;
    }
    else if( document.documentElement && document.documentElement.clientHeight )
    {
        //IE 6+
        browserHeight = document.documentElement.clientHeight;
    }

    if( pageHeight > browserHeight )
    {
        document.getElementById('fade').style.height = pageHeight + 'px';
    }
    else
    {
        document.getElementById('fade').style.height = browserHeight + 'px';
    }
}

function lightboxOff()
{
    lightBoxCount--;
    if (lightBoxCount > 0)
    {
        return;
    }

    var bgDiv = document.getElementById('fade');
    if( bgDiv )
    {
      bgDiv.style.display = 'none';
    }
}

var popupButtonTypes = { Okay:0, Cancel:1, OkayAndCancel:2, AcceptAndDecline:4 };

var iframe;
// Base class for all online popup divs
function baseDiv(div_type)
{
  if ( !(this instanceof baseDiv) )
      return new baseDiv(div_type);

  if (div_type == "system-message") {
      this.init = function () {
          this.div = document.createElement("div");

          this.titleDiv = document.createElement("div");
          // Defined the close button
          this.closeButton = document.createElement("div");
          this.closeButton.className = "close";
          this.closeButton.innerHTML = "&times;";
          this.closeButton.text = closeButtonText;
          this.div.appendChild(this.closeButton);

          // Define the input buttons
          this.buttonType = popupButtonTypes.Okay;
          this.okayButton = document.createElement("input");
          this.okayButton.id = "okay-button";
          this.okayButton.className = "btn btn-primary"
          this.okayButton.text = okayButtonText;

      }
      this.show = function (url) {
          var message_parent = document.getElementById("content");

          message_parent.insertBefore(this.div, message_parent.firstChild);
      }

  }
  else
  {

      this.init = function () {
          this.div = document.createElement("div");
          this.div.id = "popupDiv";
          this.modalDialog = document.createElement("div");
          this.modalDialog.className = "modal-dialog";
          this.modalContent = document.createElement("div");
          this.modalContent.className = "modal-content";

          this.titleDiv = document.createElement("div");
          this.titleDiv.id = "popupDiv_title";
          this.titleDiv.className = "modal-header";
          // Defined the close button

          this.closeButton = document.createElement("div");
          this.closeButton.id = "popupDiv_closeButton";
          this.closeButton.className = "close";
          this.closeButton.innerHTML = "&times;";
          this.closeButton.text = closeButtonText;
          this.titleDiv.appendChild(this.closeButton);

          // Add the div title
          this.title = document.createElement("h4");
          this.title.className = "modal-title";
          this.title.id = "popupDiv_title-text";

          this.titleDiv.appendChild(this.title);
          this.modalContent.appendChild(this.titleDiv);
          this.modalDialog.appendChild(this.modalContent);
          this.div.appendChild(this.modalDialog);




          // Define the input buttons
          this.buttonType = popupButtonTypes.Okay;
          this.okayButton = document.createElement("input");
          this.okayButton.id = "popupDiv_okayButton";
          this.okayButton.className = "btn btn-primary"
          this.okayButton.text = okayButtonText;
          this.cancelButton = document.createElement("input");
          this.cancelButton.id = "popupDiv_cancelButton";
          this.cancelButton.className = "btn btn-default";
          this.cancelButton.text = cancelButtonText;
      }

      // Add the div to the body
      this.show = function (url) {
          document.getElementsByTagName("body")[0].appendChild(this.div);

          // Display iframe to block out SELECT boxes - hack for IE6
          /*
          * IFRAME IE-6 hack is removed
          * because:
          *    (i) It's no longer found in IE6 :: nightcrawler-23588
          *    (ii) IFRAME's empty src creates https mixed content warning :: AVT-5033
          * Tested: IE6, IE9, IE9-Compatibilty View, FF10
          */
      }
  }
  // Remove the div and all child divs from the body
  this.hide = function () {
      lightboxOff();

      var rmDiv = this.div;
      while (rmDiv.hasChildNodes()) {
          rmDiv.removeChild(rmDiv.lastChild);
      }
      if (div_type == "system-message")
      {
          document.getElementById("content").removeChild(rmDiv);
      }
      else
      {
          document.getElementsByTagName("body")[0].removeChild(rmDiv);
      }

      document.querySelector("body").classList.remove("fullscreen-popup");

      bodyPopupClass.remove();

      // Remove IE6-only hack IFRAME::see the comments above :: AVT-5033
  }

/*
*
* function called to add a button to the existing element by
* appending child.
*
* onClickEvent - pass the onClickEvent if needed; (bug : AVT-4465)
*     note: even if you don't pass onClickEvent, it would work as
*           you expected
*
*/
  // Add the buttons to the bottom of the div
  this.addButtons = function (onClickEvent, successMessage)
  {
      var buttonDiv = document.createElement("div");
      buttonDiv.id = "popupDiv_buttonContainer";
      buttonDiv.className = "modal-footer"

      if(this.modalContent)
      this.modalContent.appendChild(buttonDiv);

      switch (this.buttonType)
      {
          case popupButtonTypes.Okay:
              this.okayButton.setAttribute("type", "button");
              this.okayButton.setAttribute("value", this.okayButton.text);

              if (onClickEvent)
              {
                  this.okayButton.setAttribute("onClick", onClickEvent);
              }
              buttonDiv.appendChild(this.okayButton);
              break;

          case popupButtonTypes.Cancel:
              this.cancelButton.setAttribute("type", "button");
              this.cancelButton.setAttribute("value", this.cancelButton.text);
              if (onClickEvent)
              {
                  this.okayButton.setAttribute("onClick", onClickEvent);
              }
              buttonDiv.appendChild(this.cancelButton);
              break;

          case popupButtonTypes.Close:
              this.cancelButton.setAttribute("type", "button");
              this.cancelButton.setAttribute("value", this.closeButton.text);
              if (onClickEvent && successMessage)
              {
                  this.okayButton.setAttribute("onClick", onClickEvent);
              }
              buttonDiv.appendChild(this.cancelButton);
              break;

          case popupButtonTypes.OkayAndCancel:
              this.cancelButton.setAttribute("type", "button");
              this.cancelButton.setAttribute("value", this.cancelButton.text);
              if (onClickEvent)
              {
                  this.okayButton.setAttribute("onClick", onClickEvent);
              }
              buttonDiv.appendChild(this.cancelButton);
              this.okayButton.setAttribute("type", "button");
              this.okayButton.setAttribute("value", this.okayButton.text);
              if (onClickEvent)
              {
                  this.okayButton.setAttribute("onClick", onClickEvent);
              }
              buttonDiv.appendChild(this.okayButton);
              break;

          case popupButtonTypes.AcceptAndDecline :
              this.cancelButton.setAttribute("type", "button");
              this.cancelButton.setAttribute("value", declineButtonText);
              if (onClickEvent)
              {
                  this.okayButton.setAttribute("onClick", onClickEvent);
              }
              buttonDiv.appendChild(this.cancelButton);
              this.okayButton.setAttribute("type", "button");
              this.okayButton.setAttribute("value", acceptButtonText);
              if (onClickEvent)
              {
                  this.okayButton.setAttribute("onClick", onClickEvent);
              }
              buttonDiv.appendChild(this.okayButton);
              break;
      }
  }
}

function bind(scope, fn)
{
    return function () { fn.apply(scope, arguments); };
}

// --------- Information Pop up used for help and privacy policy modal pop-ups --------

function showInformationPopup(title, url)
{
  lightBoxOn();
  if ( !(this instanceof showInformationPopup) )
    return new showInformationPopup(title, url);

  this.init();
  this.div.className = "popup-info";
  this.title.appendChild( document.createTextNode( title ) );

  tsSetEventListener( this.closeButton, "click", bind(this, this.hide) );
  tsSetEventListener( this.okayButton, "click", bind(this, this.hide) );

  var frameContainer = document.createElement("div");
  frameContainer.className = "modal-body info-content";

  var infoIFrame = document.createElement( "iframe" );
  infoIFrame.src = url;
  infoIFrame.width = "100%";
  infoIFrame.height = "100%";
  infoIFrame.frameBorder = 0;
  infoIFrame.id = "information_iframe";

  if (isIOS())
    infoIFrame.scrolling = "no";
  else
    infoIFrame.scrolling = "auto";
  
  frameContainer.appendChild( infoIFrame );
  this.modalContent.appendChild( frameContainer );

  this.addButtons();
  this.show(url);

  if (!isIOS()) {
     document.getElementById(this.okayButton.id).focus();
  }

  bodyPopupClass.add();
}
showInformationPopup.prototype = new baseDiv();

// ------------- Address Verification Pop-up ---------------------

function showAddressVerificationPopup( title, cancelRedirect )
{
  lightBoxOn();
  if ( !(this instanceof showAddressVerificationPopup) )
    return new showAddressVerificationPopup( title, cancelRedirect );

  this.init();
  this.div.className = "popup-addressVerification";
  this.title.appendChild( document.createTextNode( title ) );

  // Fix for IE bug when trying to dynamically post a form to an iframe created in DOM
  var frameContainer = document.createElement( "div" );
  frameContainer.className = "modal-body address-lookup";
  frameContainer.innerHTML = "<iframe id='addressVerification_iframe' name='addressVerification_iframe' width='100%' height='92%' scrolling='auto' frameBorder='0'>";
  this.modalContent.appendChild( frameContainer );

  this.buttonType = popupButtonTypes.OkayAndCancel;
  var cancelAction = bind(this, this.hide);
  tsSetEventListener(this.closeButton, "click", cancelAction);
  tsSetEventListener(this.cancelButton, "click", cancelAction);

  tsSetEventListener( this.okayButton, "click",
    function ()
    {
      var address_id = addressVerification_iframe.document.getElementById( 'lookupAddress::address_id' ).value;
      var selected_address = addressVerification_iframe.document.getElementById( 'lookupAddress::selected_address' ).value;
      if ( selected_address != "" ) addressVerificationCallback( address_id, selected_address );
    }
  );

  this.addButtons();
  this.show('');
  document.getElementById(this.okayButton.id).disabled = true;
}
showAddressVerificationPopup.prototype = new baseDiv();

// -------------------------- reload gift card -----------------------

function showReloadPopup( title, cancelRedirect )
{
  lightBoxOn();
  if ( !(this instanceof showReloadPopup) )
    return new showReloadPopup( title, cancelRedirect );

  this.init();
  this.div.className = "popup-giftCard";
  this.title.appendChild( document.createTextNode( title ) );

  // Fix for IE bug when trying to dynamically post a form to an iframe created in DOM
  var frameContainer = document.createElement( "div" );
  frameContainer.className = "modal-body info-content";
  frameContainer.innerHTML = "<iframe id='reloadCard_iframe' name='reloadCard_iframe' width='100%' height='100%' frameBorder='0'>";
  this.modalContent.appendChild( frameContainer );

  tsSetEventListener( this.closeButton, "click", deleteCallback );
  this.show('');
}
showReloadPopup.prototype = new baseDiv();

// -------------------------- suggested donation pop-up -----------------------

function showAddDonationPopup(title, url)
{
  lightBoxOn();
  if ( !(this instanceof showAddDonationPopup) )
    return new showAddDonationPopup(title, url);

  this.init();
  this.div.className = "popup-add-donation";
  this.title.appendChild( document.createTextNode( title ) );

  tsSetEventListener( this.closeButton, "click", bind(this, this.hide) );

  var frameContainer = document.createElement( "div" );
  frameContainer.className = "modal-body";

  var donationIFrame = document.createElement( "iframe" );
  donationIFrame.src = url;
  donationIFrame.width = "100%";
  donationIFrame.height = "100%";
  donationIFrame.frameBorder = 0;
  donationIFrame.id = "addDonation_iframe";

  if (isIOS())
    donationIFrame.scrolling = "no";
  else
    donationIFrame.scrolling = "auto";

  frameContainer.appendChild( donationIFrame );
  this.modalContent.appendChild( frameContainer );

  this.show(url);

  bodyPopupClass.add();
}
showAddDonationPopup.prototype = new baseDiv();


// -------------------------- Add friend to admission pop-up -----------------------

function showAddAdmissionCustomer(title, url)
{
  lightBoxOn();
  if ( !(this instanceof showAddAdmissionCustomer) )
    return new showAddAdmissionCustomer(title, url);

  this.init();
  this.div.className = "popup-add-admission-customer";
  this.title.appendChild( document.createTextNode( title ) );

  tsSetEventListener( this.closeButton, "click", bind(this, this.hide) );

  var frameContainer = document.createElement( "div" );
  frameContainer.className = "modal-body";

  var admissionCustomerIFrame = document.createElement( "iframe" );
  admissionCustomerIFrame.src = url;
  admissionCustomerIFrame.width = "100%";
  admissionCustomerIFrame.height = "100%";
  admissionCustomerIFrame.frameBorder = 0;
  admissionCustomerIFrame.id = "addAdmissionCustomer_iframe";

  if (isIOS())
    admissionCustomerIFrame.scrolling = "no";
  else
    admissionCustomerIFrame.scrolling = "auto";

  frameContainer.appendChild( admissionCustomerIFrame );
  this.modalContent.appendChild( frameContainer );

  this.show(url);

  bodyPopupClass.add();
}
showAddAdmissionCustomer.prototype = new baseDiv();

// -------------------------- Assign account to membership -----------------------

function showAssignAccount(title, url)
{
  lightBoxOn();
  if ( !(this instanceof showAssignAccount) )
    return new showAssignAccount(title, url);

  this.init();
  this.div.className = "assignAccount";
  this.title.appendChild( document.createTextNode( title ) );

  tsSetEventListener( this.closeButton, "click", bind(this, this.hide) );

  var frameContainer = document.createElement( "div" );
  frameContainer.className = "modal-body";

  var assignAccountIfrm = document.createElement( "iframe" );
  assignAccountIfrm.src = url;
  assignAccountIfrm.width = "100%";
  assignAccountIfrm.height = "350px";
  assignAccountIfrm.frameBorder = 0;
  assignAccountIfrm.id = "assignAccountIfrm";

  if (isIOS())
    assignAccountIfrm.scrolling = "no";
  else
    assignAccountIfrm.scrolling = "auto";

  frameContainer.appendChild( assignAccountIfrm );
  this.modalContent.appendChild( frameContainer );

  this.show(url);

  bodyPopupClass.add();
}
showAssignAccount.prototype = new baseDiv();


// -------------------------- redeem gift card -----------------------

function showRedeemGiftCardPopup(title, url)
{
  lightBoxOn();
  if ( !(this instanceof showRedeemGiftCardPopup) )
    return new showRedeemGiftCardPopup(title, url);

  this.init();
  this.div.className = "popup-giftCard";
  this.title.appendChild( document.createTextNode( title ) );

  tsSetEventListener( this.closeButton, "click", bind(this, this.hide) );

  var frameContainer = document.createElement( "div" );
  frameContainer.className = "modal-body info-content";

  var donationIFrame = document.createElement( "iframe" );
  donationIFrame.src = url;
  donationIFrame.width = "100%";
  donationIFrame.height = "100%";
  donationIFrame.frameBorder = 0;
  donationIFrame.id = "redeemGiftCard_iframe";
  
  if (isIOS())
    donationIFrame.scrolling = "no";
  else
    donationIFrame.scrolling = "auto";

  tsSetEventListener( this.closeButton, "click", function () { parent.document.location = "orderContact.asp"; } );

  this.frameContainer.appendChild( donationIFrame );
  this.modalContent.appendChild( frameContainer );

  this.show(url);
}
showRedeemGiftCardPopup.prototype = new baseDiv();

// -------------------------- section pop-up -----------------------

function showSectionPopup(url, message, performance_name)
{
  lightBoxOn();
  if ( !(this instanceof showSectionPopup) )
    return new showSectionPopup(url, message, performance_name);

  this.init();
  this.div.className = "popup-section";
  this.title.appendChild( document.createTextNode( sectionHeaderText ) );

  tsSetEventListener( this.closeButton, "click", bind(this, this.hide) );
  tsSetEventListener( this.okayButton, "click", bind(this, this.hide) );

  var frameContainer = document.createElement( "div" );
  frameContainer.className = "modal-body";

  var pPerfName = document.createElement( "h4" );
  pPerfName.className = "header";
  pPerfName.appendChild( document.createTextNode( performance_name ) );
  frameContainer.appendChild( pPerfName );

  var pMessage = document.createElement( "p" );
  pMessage.appendChild( document.createTextNode( message ) );
  frameContainer.appendChild( pMessage );

  var sectionIFrame = document.createElement( "iframe" );
  sectionIFrame.src = url;
  sectionIFrame.width = "100%";
  sectionIFrame.height = "75%";
  sectionIFrame.frameBorder = 0;
  sectionIFrame.id = "section";

  if (isIOS())
    sectionIFrame.scrolling = "no";
  else
    sectionIFrame.scrolling = "auto";

  frameContainer.appendChild( sectionIFrame );
  this.modalContent.appendChild( frameContainer );

  this.addButtons();
  this.show(url);
  if (!isIOS()) {
    document.getElementById(this.okayButton.id).focus();
  }
}
showSectionPopup.prototype = new baseDiv();

// -------------------------- Alert Pop-ups -----------------------

function showAlertPopup(errorMessage, errorContext, successMessage, successContext, timeoutMessage, timeoutContext, onClickEvent)
{

  if ( !(this instanceof showAlertPopup) )
    return new showAlertPopup(errorMessage, errorContext, successMessage, successContext, timeoutMessage, timeoutContext);

  this.init();
  this.div.className = "system-message-block";

  tsSetEventListener( this.closeButton, "click", bind(this, this.hide) );
  tsSetEventListener( this.okayButton, "click", bind(this, this.hide) );

  if ((errorMessage != undefined && errorMessage != "") || (errorContext != undefined && errorContext != ""))
  {
    var popupText = document.createElement("div");
    popupText.className = "message-content";
    var popupContext = document.createElement("div");
    popupText.className = "message-context";

    var errorSection = document.createElement( "div" );
    errorSection.id = "error-message";
    this.div.className += " alert error-message";

    if( errorMessage != undefined && errorMessage != "" )
    {
      splitMsgText( errorMessage, popupText );
      errorSection.appendChild( popupText );
    }

    if( errorContext != undefined && errorContext != "" )
    {
      splitMsgText( errorContext, popupContext );
      errorSection.appendChild( popupContext );
    }
    this.div.appendChild(errorSection);
  }

  // if the successMessage has a "!", then do not display the message at all (AVT-4980)
  if ((successMessage != undefined && successMessage != "" && successMessage != "!" ) || (successContext != undefined && successContext != ""))
  {
      var popupText = document.createElement("div");
      popupText.className = "message-content";
      var popupContext = document.createElement("div");
      popupText.className = "message-context";

      var successSection = document.createElement( "div" );
      successSection.id = "success-message";
      this.div.className += " alert info-message";

      if( successMessage != undefined && successMessage != "" )
      {
        splitMsgText( successMessage, popupText );
        successSection.appendChild( popupText );
      }

      if( successContext != undefined && successContext != "" )
      {
        splitMsgText( successContext, popupContext );
        successSection.appendChild( popupContext );
      }
        this.div.appendChild(successSection);
  }

  if ((timeoutMessage != undefined && timeoutMessage != "") || (timeoutContext != undefined && timeoutContext != ""))
  {
      var popupText = document.createElement("div");
      popupText.className = "message-content";
      var popupContext = document.createElement("div");
      popupText.className = "message-context";

      var timeoutSection = document.createElement( "div" );
      timeoutSection.id = "timeout-message ";
      this.div.className += " alert timeout-message";

      if( timeoutMessage != undefined && timeoutMessage != "" )
      {
        splitMsgText( timeoutMessage, popupText );
        timeoutSection.appendChild( popupText );
      }

      if( timeoutContext != undefined && timeoutContext != "" )
      {
          splitMsgText(timeoutContext, popupContext);
          timeoutSection.appendChild(popupContext);
      }
        this.div.appendChild(timeoutSection);
  }

  if (onClickEvent) {
      this.addButtons(onClickEvent, successMessage);
  }

  this.show('');

}
showAlertPopup.prototype = new baseDiv("system-message");


// Pass in the message, context, and the function to call when the okay button is clicked
function showConfirmPopup( message, context, okayAction, cancelAction )
{
  lightBoxOn();
  if ( !(this instanceof showConfirmPopup) )
    return new showConfirmPopup(message, context, okayAction, cancelAction);

  this.init();
  this.div.className = "popup-confirm";
  this.title.appendChild( document.createTextNode( alertHeaderText ) );

  this.buttonType = popupButtonTypes.OkayAndCancel;
  okayAction = ( okayAction == "" ) ? bind(this, this.hide) : okayAction;
  cancelAction = ( cancelAction == "" ) ? bind(this, this.hide) : cancelAction;

  tsSetEventListener( this.okayButton, "click", okayAction );
  tsSetEventListener( this.closeButton, "click", cancelAction );
  tsSetEventListener( this.cancelButton, "click", cancelAction );

  var confirmSection = document.createElement( "div" );
  confirmSection.id = "popupDiv_confirmDiv";
  confirmSection.className = "modal-body";

  var pMessage = document.createElement( "p" );
  pMessage.className = "header";
  pMessage.appendChild( document.createTextNode( message ) );
  confirmSection.appendChild( pMessage );

  var pContext = document.createElement( "p" );
  pContext.appendChild( document.createTextNode( context ) );
  confirmSection.appendChild( pContext );

  this.modalContent.appendChild( confirmSection );

  this.addButtons();
  this.show('');

  if (!isIOS()) {
    document.getElementById(this.okayButton.id).focus();
  }
}
showConfirmPopup.prototype = new baseDiv();


// -------------- Terms and Conditions Pop-up -------------------------------

function showTermsPopupI(title, url, okayAction, cancelAction)
{
    lightBoxOn();
    if (!(this instanceof showTermsPopupI))
        return new showTermsPopupI(title, url);

    this.init();
    this.div.className = "popup-Terms";
    this.title.appendChild(document.createTextNode(title));

    var frameContainer = document.createElement( "div" );
    frameContainer.className = "modal-body info-content";

    var termsIFrame = document.createElement("iframe");
    termsIFrame.src = url;
    termsIFrame.width = "100%";
    termsIFrame.height = "100%";
    termsIFrame.frameBorder = 0;
    termsIFrame.id = "terms_iframe";
    
    if (isIOS())
      termsIFrame.scrolling = "no";
    else
      termsIFrame.scrolling = "auto";
    
    this.buttonType = popupButtonTypes.AcceptAndDecline;
    okayAction = (okayAction == "") ? bind(this, this.hide) : okayAction;
    cancelAction = (cancelAction == "") ? bind(this, this.hide) : cancelAction;

    tsSetEventListener(this.okayButton, "click", okayAction);
    tsSetEventListener(this.closeButton, "click", cancelAction);
    tsSetEventListener(this.cancelButton, "click", cancelAction);

    frameContainer.appendChild(termsIFrame);
    this.modalContent.appendChild(frameContainer);

    this.addButtons();
    this.show('');
    if (!isIOS()) {
      document.getElementById(this.okayButton.id).focus();
    }
    this.show(url);
    if (!isIOS()) {
      document.getElementById(this.okayButton.id).focus();
    }

    bodyPopupClass.add();
}
showTermsPopupI.prototype = new baseDiv();





/*
  This function will set up events correctly.
  eventTarget - the object that will be the source of the event
  eventName - the name of the event (without 'on' at the front! e.g. 'click' as opposed to 'onclick')
  callback - a function reference (not a string, don't quote this) */
function tsSetEventListener(eventTarget, eventName, callback)
{
  if(window.addEventListener)
    eventTarget.addEventListener(eventName, callback, false);
  else
    eventTarget.attachEvent("on" + eventName, callback);
}

function closePopupDiv()
{
    var msgDiv = document.getElementById("popupDiv");
    while (msgDiv)
    {
        while(msgDiv.hasChildNodes())
        {
            msgDiv.removeChild(msgDiv.lastChild);
        }
        document.getElementsByTagName( "body" )[0].removeChild( msgDiv );

        msgDiv = document.getElementById("popupDiv");
    }
}

// This function is used to split text separated by "\n" into separate lines of the alert message.
function splitMsgText( text, outerElement )
{
  var msgLine = new Array();
  msgLine = text.split( "\n" );

  for (var i = 0; i < msgLine.length; i++) {
      var msgLine_element = document.createElement("div");
      msgLine_element.appendChild(document.createTextNode(msgLine[i]));
      outerElement.appendChild(msgLine_element);
  }
}

//
// toggleElemDisplay toggles the display style of the element identified
// by elemid. Optional display style may be passed in to set some specific
// visible style, such as table-row-group or block.
//
function toggleElemDisplay( elemid, dispstyle )
{
  var elem = document.getElementById(elemid);

  if(elem != null && elem.style != null) {
    if(elem.style.display != "none" )
      elem.style.display = "none";
    else
      elem.style.display = dispstyle ? dispstyle : "";
  }
}

function QuickLogOut()
{
  document.location = "../../Online/logout.asp?timeout=";
}


function validateRadio( group, name )
{
  // make sure the list of form controls is valid
  if(group == null || group.length == undefined)
    return null;

  for(var i = 0; i < group.length; i++)
  {
    // check only those elements that match name
    if(group[i].name == name && group[i].checked)
      return group[i].value;
  }

  return null;
}

// -------------------- add Friend balance pop-up  --------------------

function addFriendPopup(title, url) {
    lightBoxOn();
    if (!(this instanceof addFriendPopup))
        return new addFriendPopup(title, url);

    this.init();
    this.div.className = "popup-add-friend";
    this.title.appendChild(document.createTextNode(title));

    tsSetEventListener(this.closeButton, "click", bind(this, this.hide));

    var frameContainer = document.createElement("div");
    frameContainer.className = "modal-body info-content";

    var donationIFrame = document.createElement("iframe");
    donationIFrame.src = url;
    donationIFrame.width = "100%";
    donationIFrame.height = "100%";
    donationIFrame.frameBorder = 0;
    donationIFrame.id = "giftCard_iframe";
    
    if (isIOS())
      donationIFrame.scrolling = "no";
    else
      donationIFrame.scrolling = "auto";

    frameContainer.appendChild(donationIFrame);
    this.modalContent.appendChild(frameContainer);

    this.show(url);
}
addFriendPopup.prototype = new baseDiv();

// -------------------- Gift Card balance pop-up  --------------------

function showGiftCardPopup(title, url)
{
  lightBoxOn();
  if ( !(this instanceof showGiftCardPopup) )
    return new showGiftCardPopup(title, url);

  this.init();
  this.div.className = "popup-giftCard";
  this.title.appendChild( document.createTextNode( title ) );

  tsSetEventListener( this.closeButton, "click", bind(this, this.hide) );

  var frameContainer = document.createElement( "div" );
  frameContainer.className = "modal-body info-content";

  var donationIFrame = document.createElement( "iframe" );
  donationIFrame.src = url;
  donationIFrame.width = "100%";
  donationIFrame.height = "100%";
  donationIFrame.frameBorder = 0;
  donationIFrame.id = "giftCard_iframe";
  
  if (isIOS())
    donationIFrame.scrolling = "no";
  else
    donationIFrame.scrolling = "auto";

  frameContainer.appendChild( donationIFrame );
  this.modalContent.appendChild( frameContainer );

  this.show(url);

  bodyPopupClass.add();
}
showGiftCardPopup.prototype = new baseDiv();

// -------------------- Ticket Forwarding Pop-up  --------------------

function showTicketForwardPopup(url)
{
  lightBoxOn();
  if ( !(this instanceof showTicketForwardPopup) )
    return new showTicketForwardPopup(title);

  this.init();
  this.div.className = "popup-ticket-forward";

  tsSetEventListener( this.closeButton, "click", bind(this, this.hide) );

  var frameContainer = document.createElement( "div" );
  frameContainer.className = "modal-body info-content";

  var ticketFrame = document.createElement( "iframe" );
  ticketFrame.src = url;
  ticketFrame.width = "100%";
  ticketFrame.height = "100%";
  ticketFrame.frameBorder = 0;
  ticketFrame.id = "ticketForward_iframe";
  
  if (isIOS())
    ticketFrame.scrolling = "no";
  else
    ticketFrame.scrolling = "auto";

  frameContainer.appendChild(ticketFrame);
  this.modalContent.appendChild( frameContainer );

  this.show(url);
}
showTicketForwardPopup.prototype = new baseDiv();


// -------------------- Upsell/Add-On Pop-up  --------------------

function showUpsellPopup(title, url, cancelAction, fsOpts) {
    lightBoxOn();
    if (!(this instanceof showUpsellPopup))
        return new showUpsellPopup(title, url);

    this.init();
    this.div.className = "popup-upsell";
    this.title.appendChild(document.createTextNode(title));

    this.buttonType = popupButtonTypes.Close;
    tsSetEventListener(this.closeButton, "click", bind(this, this.hide));
    tsSetEventListener(this.cancelButton, "click", cancelAction || bind(this, this.hide));

    var frameContainer = document.createElement( "div" );
    frameContainer.className = "modal-body info-content";

    var infoIFrame = document.createElement("iframe");
    infoIFrame.src = url;
    infoIFrame.width = "100%";
    infoIFrame.height = "86%";
    infoIFrame.frameBorder = 0;
    infoIFrame.id = "upsell_iframe";

    if (fsOpts && fsOpts.isFs) {
      document.body.classList.add('fullscreen-popup');

      var skipText = document.createElement('a');
      var linkText = document.createTextNode(fsOpts.skipLabel);
      skipText.appendChild(linkText);
      skipText.title = fsOpts.skipLabel;
      skipText.className = 'skip-action btn btn-primary';

      tsSetEventListener(skipText, "click", bind(this, this.hide));

      this.modalContent.appendChild(skipText);

      infoIFrame.height = "100%";
    }
    
    if (isIOS())
      infoIFrame.scrolling = "no";
    else
      infoIFrame.scrolling = "auto";
    
    frameContainer.appendChild(infoIFrame);
    this.modalContent.appendChild(frameContainer);

    this.addButtons();
    this.show(url);
}
showUpsellPopup.prototype = new baseDiv();


// This can be called from within the popup contents to close the widget itself (i.e. parent.hidePopup())
function hidePopup() {
    lightboxOff();
    var rmDiv = document.getElementById("popupDiv");

    if (rmDiv) {
        while (rmDiv.hasChildNodes()) {
            rmDiv.removeChild(rmDiv.lastChild);
        }
        document.getElementsByTagName("body")[0].removeChild(rmDiv);
    }
    // Remove IE6-only hack IFRAME::see the comments above :: AVT-5033

    bodyPopupClass.remove();
}


// javascript trim (General script)
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}

function containsValue(array, value)
{
    for(var i = 0; i < array.length; i++) {
        if(array[i] == value)
            return true;
    }

    return false;
}

function isSmallScreen()
{
    // We are relying on window.innerWidth to detect the client's window size, since in our case we don�t care about the scrollbar�s width and also have the
    // viewport restrictions set on our pages (otherwise iPhone will report full pixel width+1). Because IE8 or below won�t like it,
    // we could have a fallback to $(window).width()
    var window_width = window.innerWidth || $(window).width();
    return window_width <= 768;
}

function isTouchScreen() {
    return  navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
            navigator.userAgent.match(/Opera Mini/i) ||
            navigator.userAgent.match(/IEMobile/i);
}

//
// Check for iOS devices
//
function isIOS(){
    return /iPad|iPhone|iPod/g.test(navigator.userAgent);
}

//
// Object.create() is used for extending objects and it is defined in ECMAScript 5.
// Unfortunately IE8 and earlier versions do not implement this and we need a polyfill while we support those browsers.
//
// NOTE: "This polyfill covers the main use case which is creating a new object for which the prototype has been
// chosen but doesn't take the second argument into account." -- from Mozilla Developer Network
//
if (typeof Object.create != 'function') {
  Object.create = (function() {
    var Temp = function() {};
    return function (prototype) {
      if (arguments.length > 1) {
        throw Error('Second argument not supported');
      }
      if (typeof prototype != 'object') {
        throw TypeError('Argument must be an object');
      }
      Temp.prototype = prototype;
      var result = new Temp();
      Temp.prototype = null;
      return result;
    };
  })();
}

var bodyPopupClass = {
  className: "popup-open",
  add: function() {
    $(document.body).addClass(this.className);
  },
  remove: function() {
    $(document.body).removeClass(this.className);
  }
};

document.addEventListener("DOMContentLoaded",function(){
  if (document.querySelector('.info-article.pull-out')) {
    tsSetEventListener(document.querySelector('.info-article.pull-out'), 'click', function(e) {
      var el = $(e.currentTarget);

      if (el.hasClass('open')) {
        el.removeClass('open')
      } else {
        el.addClass('open')
      }
    });
  }  
});