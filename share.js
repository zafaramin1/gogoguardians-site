// One-tap sharing: any element with data-share opens the phone's share sheet (or copies the link on a computer).
(function () {
  var URL_ = 'https://gogoguardians.com/';
  var TEXT = 'Gogo Guardians: an illustrated adventure with a riddle game, for ages 8 to 12. The first 3 chapters are free.';
  function toast(msg) {
    var t = document.createElement('div'); t.textContent = msg;
    t.style.cssText = 'position:fixed;left:50%;bottom:72px;transform:translateX(-50%);z-index:99;padding:10px 16px;border-radius:999px;background:#1c1408;color:#f6d27a;border:1px solid #b8862b;font:700 14px system-ui,sans-serif;box-shadow:0 6px 20px #000a';
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2200);
  }
  function link() {
    // A partner who arrived through their own link (?p=KEY) shares with that key, so every share earns them credit.
    try { var o = JSON.parse(localStorage.getItem('gogoPartner') || 'null'); if (o && o.k && Date.now() - o.t < 90 * 864e5) return URL_ + '?p=' + encodeURIComponent(o.k); } catch (e) {}
    return URL_;
  }
  function share() {
    var u = link(), data = { title: 'Gogo Guardians', text: TEXT, url: u };
    if (navigator.share) { navigator.share(data).catch(function () {}); return; }
    var s = TEXT + ' ' + u;
    if (navigator.clipboard) navigator.clipboard.writeText(s).then(function () { toast('Link copied. Paste it anywhere.'); }, function () { prompt('Copy this link:', u); });
    else prompt('Copy this link:', u);
  }
  function init() { [].forEach.call(document.querySelectorAll('[data-share]'), function (b) { b.addEventListener('click', function (e) { e.preventDefault(); share(); }); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
