/*
Filename:     browser_detect.js  
Description:  Browser detection
*/

var agt = navigator.userAgent.toLowerCase();
var appVer = navigator.appVersion.toLowerCase();

var is_minor = parseFloat( appVer );
var is_major = parseInt( is_minor );

var iePos = appVer.indexOf( 'msie' );
if( iePos != -1 )
{
  is_minor = parseFloat( appVer.substring( iePos + 5, appVer.indexOf( ';', iePos ) ) )
  is_major = parseInt( is_minor );
}

var is_nav = ( ( agt.indexOf( 'mozilla' ) != -1 ) && ( agt.indexOf( 'compatible' ) == -1 ) );
var is_navonly = ( is_nav && ( ( agt.indexOf( ";nav" ) != -1 ) || ( agt.indexOf( "; nav" ) != -1 ) ) );

var is_nav2 = ( is_nav && is_major == 2 );
var is_nav3 = ( is_nav && is_major == 3 );
var is_nav4 = ( is_nav && is_major == 4 );
var is_nav4up = ( is_nav && is_minor >= 4 );
var is_nav6 = ( is_nav && is_major == 6 );
var is_nav6up = ( is_nav && is_minor >= 6 );
var is_nav7 = ( is_nav && is_major == 7 );
var is_nav7up = ( is_nav && is_minor >= 7 );

var is_ie = ( iePos != -1 );
var is_ie3 = ( is_ie && is_major < 4 );
var is_ie4 = ( is_ie && is_major == 4 );
var is_ie4up = ( is_ie && is_minor >= 4 );
var is_ie5 = ( is_ie && is_major == 5 );
var is_ie5up = ( is_ie && is_minor >= 5 );
var is_ie5_5 = ( is_ie && agt.indexOf( "msie 5.5" ) != -1 );
var is_ie5_5up = ( is_ie && is_minor >= 5.5 );
var is_ie6 = ( is_ie && is_major == 6 );
var is_ie6up = ( is_ie && is_minor >= 6 );

var is_getElementById = ( document.getElementById ) ? "true" : "false";