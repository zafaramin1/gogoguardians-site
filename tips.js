// "?" info tips. Markup: <button type="button" class="qtip" aria-label="More about this">?</button><span class="qtip-body">Explanation</span>
// Tapping the ? opens the explanation as a small parchment right after the line (the paragraph, list item or card) that holds it.
(function () {
  var n = 0;
  function blockOf(el) {
    var b = el.parentElement;
    while (b && b !== document.body && !/^(P|LI|DIV|TD|H2|H3|DD)$/.test(b.tagName)) b = b.parentElement;
    return b || el.parentElement;
  }
  function close(btn) {
    var pop = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', 'false');
    if (!pop) return;
    pop.style.height = pop.scrollHeight + 'px';
    requestAnimationFrame(function () { pop.style.height = '0px'; });
    setTimeout(function () { if (pop.parentNode) pop.parentNode.removeChild(pop); }, 420);
  }
  function open(btn) {
    var body = btn.nextElementSibling, id = 'qtip' + (++n);
    var pop = document.createElement('span'); pop.className = 'qtip-pop'; pop.id = id; pop.setAttribute('role', 'note');
    pop.innerHTML = '<span>' + body.innerHTML + '</span>';
    var host = blockOf(btn);
    if (host.tagName === 'LI' || host.tagName === 'TD' || host.tagName === 'DIV') host.appendChild(pop);
    else host.parentNode.insertBefore(pop, host.nextSibling);
    btn.setAttribute('aria-controls', id); btn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(function () { pop.style.height = pop.scrollHeight + 'px'; });
    pop.addEventListener('transitionend', function () { if (btn.getAttribute('aria-expanded') === 'true') pop.style.height = 'auto'; });
  }
  function init() {
    [].forEach.call(document.querySelectorAll('.qtip'), function (btn) {
      if (!btn.nextElementSibling || !btn.nextElementSibling.classList.contains('qtip-body')) return;
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        if (btn.getAttribute('aria-expanded') === 'true') close(btn);
        else {
          [].forEach.call(document.querySelectorAll('.qtip[aria-expanded="true"]'), close);
          open(btn);
        }
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
