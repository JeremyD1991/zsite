function OpenProfileId(){function h(){var r=!1,n="",t=null,i="",u="";try{i="AcroPDF.PDF";t=new ActiveXObject(i)}catch(f){}if(!t)try{i="PDF.PdfCtrl";t=new ActiveXObject(i)}catch(f){}if(t)try{r=!0;u=i;n=t.GetVersions().split(",");n=n[0].split("=");n=parseFloat(n[1])}catch(f){}return{isInstalled:r,version:n,name:u}}function c(){var r=!1,n="",t=null,i="",u="";try{i="ShockwaveFlash.ShockwaveFlash";t=new ActiveXObject(i)}catch(f){}if(t)try{r=!0;u=i;n=t.GetVariable("$version").substring(4);n=n.split(",");n=parseFloat(n[0]+"."+n[1])}catch(f){}return{isInstalled:r,version:n,name:u}}function l(){var n=!1,t="";try{n=navigator.javaEnabled();t=n?"Java":""}catch(i){}return{isInstalled:n,version:"",name:t}}function a(){var r=!1,n="",t=null,i="",u="";try{i="QuickTime.QuickTime";t=new ActiveXObject(i)}catch(f){}if(t)try{r=!0;u=i;n=t.QuickTimeVersion.toString(16);n=n.substring(0,1)+"."+n.substring(1,3);n=parseFloat(n)}catch(f){}return{isInstalled:r,version:n,name:u}}function v(){for(var u=!1,n="",r=["rmocx.RealPlayer G2 Control","rmocx.RealPlayer G2 Control.1","RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)","RealVideo.RealVideo(tm) ActiveX Control (32-bit)","RealPlayer"],t=null,f="",e="",i=0;i<r.length;i++){try{t=new ActiveXObject(r[i])}catch(o){continue}if(t){f=r[i];break}}if(t)try{u=!0;e=f;n=t.GetVersionInfo();n=parseFloat(n)}catch(o){}return{isInstalled:u,version:n,name:e}}function y(){var r=!1,n="",t=null,i="",u="";try{i="SWCtl.SWCtl";t=new ActiveXObject(i)}catch(f){}if(t)try{r=!0;u=i;n=t.ShockwaveVersion("").split("r");n=parseFloat(n[0])}catch(f){}return{isInstalled:r,version:n,name:u}}function p(){var i=!1,r="",n=null,t="",u="";try{t="WMPlayer.OCX";n=new ActiveXObject(t)}catch(f){}if(n)try{i=!0;u=t;r=parseFloat(n.versionInfo)}catch(f){}return{isInstalled:i,version:r,name:u}}function w(){var n="|",r="",u={},f=[],t,e,i;try{if(window.navigator.plugins&&window.navigator.plugins.length){for(t=0,e=window.navigator.plugins.length;t<e;t++)i=window.navigator.plugins[t].name||"",u.hasOwnProperty(i)||(u[i]="",f.push(i));r=f.join(n)}else window.ActiveXObject&&(r=h().name+n+c().name+n+l().name+n+a().name+n+v().name+n+y().name+n+p().name)}catch(o){}return r}function b(){var t=new Date,n=t.getTimezoneOffset()/-60;return n=(n>0?"+":"")+n,"GMT"+n}function e(f,e){var o=f[0],s=f[1],h=f[2],c=f[3];o=n(o,s,h,c,e[0],7,-680876936);c=n(c,o,s,h,e[1],12,-389564586);h=n(h,c,o,s,e[2],17,606105819);s=n(s,h,c,o,e[3],22,-1044525330);o=n(o,s,h,c,e[4],7,-176418897);c=n(c,o,s,h,e[5],12,1200080426);h=n(h,c,o,s,e[6],17,-1473231341);s=n(s,h,c,o,e[7],22,-45705983);o=n(o,s,h,c,e[8],7,1770035416);c=n(c,o,s,h,e[9],12,-1958414417);h=n(h,c,o,s,e[10],17,-42063);s=n(s,h,c,o,e[11],22,-1990404162);o=n(o,s,h,c,e[12],7,1804603682);c=n(c,o,s,h,e[13],12,-40341101);h=n(h,c,o,s,e[14],17,-1502002290);s=n(s,h,c,o,e[15],22,1236535329);o=t(o,s,h,c,e[1],5,-165796510);c=t(c,o,s,h,e[6],9,-1069501632);h=t(h,c,o,s,e[11],14,643717713);s=t(s,h,c,o,e[0],20,-373897302);o=t(o,s,h,c,e[5],5,-701558691);c=t(c,o,s,h,e[10],9,38016083);h=t(h,c,o,s,e[15],14,-660478335);s=t(s,h,c,o,e[4],20,-405537848);o=t(o,s,h,c,e[9],5,568446438);c=t(c,o,s,h,e[14],9,-1019803690);h=t(h,c,o,s,e[3],14,-187363961);s=t(s,h,c,o,e[8],20,1163531501);o=t(o,s,h,c,e[13],5,-1444681467);c=t(c,o,s,h,e[2],9,-51403784);h=t(h,c,o,s,e[7],14,1735328473);s=t(s,h,c,o,e[12],20,-1926607734);o=i(o,s,h,c,e[5],4,-378558);c=i(c,o,s,h,e[8],11,-2022574463);h=i(h,c,o,s,e[11],16,1839030562);s=i(s,h,c,o,e[14],23,-35309556);o=i(o,s,h,c,e[1],4,-1530992060);c=i(c,o,s,h,e[4],11,1272893353);h=i(h,c,o,s,e[7],16,-155497632);s=i(s,h,c,o,e[10],23,-1094730640);o=i(o,s,h,c,e[13],4,681279174);c=i(c,o,s,h,e[0],11,-358537222);h=i(h,c,o,s,e[3],16,-722521979);s=i(s,h,c,o,e[6],23,76029189);o=i(o,s,h,c,e[9],4,-640364487);c=i(c,o,s,h,e[12],11,-421815835);h=i(h,c,o,s,e[15],16,530742520);s=i(s,h,c,o,e[2],23,-995338651);o=r(o,s,h,c,e[0],6,-198630844);c=r(c,o,s,h,e[7],10,1126891415);h=r(h,c,o,s,e[14],15,-1416354905);s=r(s,h,c,o,e[5],21,-57434055);o=r(o,s,h,c,e[12],6,1700485571);c=r(c,o,s,h,e[3],10,-1894986606);h=r(h,c,o,s,e[10],15,-1051523);s=r(s,h,c,o,e[1],21,-2054922799);o=r(o,s,h,c,e[8],6,1873313359);c=r(c,o,s,h,e[15],10,-30611744);h=r(h,c,o,s,e[6],15,-1560198380);s=r(s,h,c,o,e[13],21,1309151649);o=r(o,s,h,c,e[4],6,-145523070);c=r(c,o,s,h,e[11],10,-1120210379);h=r(h,c,o,s,e[2],15,718787259);s=r(s,h,c,o,e[9],21,-343485551);f[0]=u(o,f[0]);f[1]=u(s,f[1]);f[2]=u(h,f[2]);f[3]=u(c,f[3])}function f(n,t,i,r,f,e){return t=u(u(t,n),u(r,e)),u(t<<f|t>>>32-f,i)}function n(n,t,i,r,u,e,o){return f(t&i|~t&r,n,t,u,e,o)}function t(n,t,i,r,u,e,o){return f(t&r|i&~r,n,t,u,e,o)}function i(n,t,i,r,u,e,o){return f(t^i^r,n,t,u,e,o)}function r(n,t,i,r,u,e,o){return f(i^(t|~r),n,t,u,e,o)}function k(n){var u,r,t,i;for(/[\x80-\xFF]/.test(n)&&(n=unescape(encodeURI(n))),txt="",u=n.length,r=[1732584193,-271733879,-1732584194,271733878],t=64;t<=n.length;t+=64)e(r,d(n.substring(t-64,t)));for(n=n.substring(t-64),i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],t=0;t<n.length;t++)i[t>>2]|=n.charCodeAt(t)<<(t%4<<3);if(i[t>>2]|=128<<(t%4<<3),t>55)for(e(r,i),t=0;t<16;t++)i[t]=0;return i[14]=u*8,e(r,i),r}function d(n){for(var i=[],t=0;t<64;t+=4)i[t>>2]=n.charCodeAt(t)+(n.charCodeAt(t+1)<<8)+(n.charCodeAt(t+2)<<16)+(n.charCodeAt(t+3)<<24);return i}function g(n){for(var i="",t=0;t<4;t++)i+=o[n>>t*8+4&15]+o[n>>t*8&15];return i}function nt(n){for(var t=0;t<n.length;t++)n[t]=g(n[t]);return n.join("")}function s(n){return nt(k(n))}function u(n,t){return n+t&4294967295}function tt(n){return s(n)}var o="0123456789abcdef".split("");if(s("hello")!="5d41402abc4b2a76b9719d911017c592"){function u(n,t){var i=(n&65535)+(t&65535),r=(n>>16)+(t>>16)+(i>>16);return r<<16|i&65535}}this.getId=function(){var n="";try{var t=window.navigator.userAgent,i=w(),r=b(),u=window.screen.width,f=window.screen.height,e=window.screen.pixelDepth,o=t+i+r+u+f+e;n=tt(o)}catch(s){}return n};this.getVersion=function(){return"1.1"};this.getSite=function(){return window.location.host+window.location.pathname}}function TTDUniversalPixelApi(n){function i(n,t){t=t.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var r=new RegExp("[\\?&]"+t+"=([^&#]*)"),i=r.exec(n);return i===null?"":decodeURIComponent(i[1].replace(/\+/g," "))}function r(){var t=window,n="",r=!1;try{top.location.href&&(n=top.location.href)}catch(u){r=!0}if(r)for(;;)try{if(n=t.document.referrer,window.parent!=t)t=window.parent;else break}catch(u){break}return-1<n.indexOf("cloudfront.net")&&(n=i(n,"url")||n),n}var t="1.1.3";this.getVersion=function(){return t};this.init=function(t,i,u,f){function y(n){function r(n){return n?"1":"0"}function i(){c.appendChild(t)}n!=null&&(o=o+"&gdpr="+r(n.gdprApplies)+"&gdpr_consent="+n.consentData);var t=document.createElement("iframe");t.setAttribute("id","universal_pixel");t.setAttribute("allowTransparency",!0);t.setAttribute("height",0);t.setAttribute("width",0);t.setAttribute("style","display:none;");t.setAttribute("src",o);document.readyState==="complete"?setTimeout(i,0):window.addEventListener?window.addEventListener("load",i):window.attachEvent?window.attachEvent("onload",i):i()}var c,s,e,h,l,a;if(typeof arguments[3]=="string"&&(arguments[3]=null,arguments.length>4))for(e=4;e<arguments.length;e++)arguments[e-1]=arguments[e];if(t&&t!=""&&i&&!(i.length<=0)&&(c=document.getElementsByTagName("body")[0],c)){var v=new OpenProfileId,o="",p=v.getId(),w=v.getVersion();if(paramMap={MonetaryValue:"v",MonetaryValueFormat:"vf"},s=[],typeof _pixelParams!="undefined")for(e in _pixelParams)h=_pixelParams[e],l=paramMap[e],l&&h&&!/%%.*%%/i.test(h)&&s.push(l+"="+encodeURIComponent(h));var b="adv="+t,k="upid="+i.join(","),d=n||r();if(o=u+"?"+b+"&ref="+encodeURIComponent(d)+"&"+k+"&osi="+p+"&osv="+w+"&upv="+this.getVersion(),f)for(a in f)o=o+"&"+a+"="+f[a];s.length>0&&(o=o+"&"+s.join("&"));typeof __cmp=="function"?__cmp("getConsentData",null,y):y()}}}var ttd_dom_ready=function(){function u(){if(!n.isReady){try{document.documentElement.doScroll("left")}catch(t){setTimeout(u,1);return}n.ready()}}function f(t){n.bindReady();var i=n.type(t);r.done(t)}var r,i,t={},n;return t["[object Boolean]"]="boolean",t["[object Number]"]="number",t["[object String]"]="string",t["[object Function]"]="function",t["[object Array]"]="array",t["[object Date]"]="date",t["[object RegExp]"]="regexp",t["[object Object]"]="object",n={isReady:!1,readyWait:1,holdReady:function(t){t?n.readyWait++:n.ready(!0)},ready:function(t){if(t===!0&&!--n.readyWait||t!==!0&&!n.isReady){if(!document.body)return setTimeout(n.ready,1);if(n.isReady=!0,t!==!0&&--n.readyWait>0)return;r.resolveWith(document,[n])}},bindReady:function(){if(!r){if(r=n._Deferred(),document.readyState==="complete")return setTimeout(n.ready,1);if(document.addEventListener)document.addEventListener("DOMContentLoaded",i,!1),window.addEventListener("load",n.ready,!1);else if(document.attachEvent){document.attachEvent("onreadystatechange",i);window.attachEvent("onload",n.ready);var t=!1;try{t=window.frameElement==null}catch(f){}document.documentElement.doScroll&&t&&u()}}},_Deferred:function(){var r=[],t,u,f,i={done:function(){if(!f){var h=arguments,u,c,e,s,o;for(t&&(o=t,t=0),u=0,c=h.length;u<c;u++)e=h[u],s=n.type(e),s==="array"?i.done.apply(i,e):s==="function"&&r.push(e);o&&i.resolveWith(o[0],o[1])}return this},resolveWith:function(n,i){if(!f&&!t&&!u){i=i||[];u=1;try{while(r[0])r.shift().apply(n,i)}finally{t=[n,i];u=0}}return this},resolve:function(){return i.resolveWith(this,arguments),this},isResolved:function(){return!!(u||t)},cancel:function(){return f=1,r=[],this}};return i},type:function(n){return n==null?String(n):t[Object.prototype.toString.call(n)]||"object"}},document.addEventListener?i=function(){document.removeEventListener("DOMContentLoaded",i,!1);n.ready()}:document.attachEvent&&(i=function(){document.readyState==="complete"&&(document.detachEvent("onreadystatechange",i),n.ready())}),f}();
//# sourceMappingURL=up_loader.1.1.3.min.js.map