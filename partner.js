// Partner credit: a partner shares any gogoguardians.com link with ?p=<their Payhip affiliate key>.
// We remember the key for 90 days (longer than Payhip's 30-day cookie; checkout passes the key to Payhip at purchase time) and /checkout/ sends the buyer to the partner's Payhip link.
(function(){try{var k=new URLSearchParams(location.search).get('p');if(k&&/^[A-Za-z0-9_-]{3,40}$/.test(k))localStorage.setItem('gogoPartner',JSON.stringify({k:k,t:Date.now()}));}catch(e){}})();
