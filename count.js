// Visitor counts: page + where the visit came from, added to a daily count. No cookies, no personal data.
(function(){try{
var GS='https://script.google.com/macros/s/AKfycbwqA1VJG6I0bxBLmsr0cd_okIm-n9G5QW_BHgnLbP3xryLFGm_Zb5sAnifrgrNFGIWGjg/exec';
var p=location.pathname.replace(/\/+$/,'')||'/';
var map={'/':'home','/buy':'buy','/checkout':'checkout','/trailer':'trailer','/read':'read','/play':'play','/schools':'schools','/s':'school-page','/gift':'gift','/partners':'partners','/preview':'preview','/groups':'groups','/kit':'kit','/thanks':'thanks','/guide':'guide','/go':'go'};
var page=map[p];if(!page)return;
var q=new URLSearchParams(location.search),src=null;
// Our own browsers: open any page once with ?notrack=1 and that browser is never counted (?notrack=0 undoes it).
try{if(q.get('notrack')==='1')localStorage.setItem('gg_notrack','1');if(q.get('notrack')==='0')localStorage.removeItem('gg_notrack');if(localStorage.getItem('gg_notrack')==='1')return;}catch(e){}
try{src=sessionStorage.getItem('gg_src')}catch(e){}
if(!src){
 var r='';try{r=document.referrer?new URL(document.referrer).hostname:''}catch(e){}
 var med=(q.get('utm_medium')||'').toLowerCase();
 if((q.get('src')||'').toLowerCase()==='teacher')src='teacher';
 else if(q.get('gclid')||q.get('gbraid')||q.get('wbraid')||/cpc|ppc|paid/.test(med))src='ad';
 else if(q.get('p'))src='partner';
 else if(med==='email'||/mail\./.test(r))src='email';
 else if(/google\.|bing\.|duckduckgo\.|yahoo\.|ecosia\./.test(r))src='search';
 else if(/facebook\.|instagram\.|linkedin\.|youtube\.|t\.co$|twitter\.|x\.com|tiktok\.|pinterest\.|whatsapp\./.test(r))src='social';
 else if(!r)src='direct';
 else if(/gogoguardians\.com$/.test(r))src='direct';
 else src='other';
 try{sessionStorage.setItem('gg_src',src)}catch(e){}
}
fetch(GS+'?hit='+page+'&src='+src,{mode:'no-cors',keepalive:true}).catch(function(){});
}catch(e){}})();
