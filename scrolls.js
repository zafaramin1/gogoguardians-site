// Turns <div class="scrolls"><div class="scroll"><h3>Question</h3><div>Answer</div></div>...</div> into tap-to-unroll scrolls.
(function () {
  function build(group, gi) {
    var items = [].slice.call(group.querySelectorAll(':scope > .scroll'));
    items.forEach(function (s, i) {
      var head = s.firstElementChild, body = head.nextElementSibling, id = 'sc' + gi + '-' + i;
      var sheet = document.createElement('div'); sheet.className = 'sheet';
      var q = document.createElement('button'); q.type = 'button'; q.className = 'q';
      q.setAttribute('aria-expanded', 'false'); q.setAttribute('aria-controls', id);
      q.innerHTML = '<span>' + head.innerHTML + '</span><span class="seal" aria-hidden="true"><i></i><i></i></span>';
      var a = document.createElement('div'); a.className = 'a'; a.id = id; a.setAttribute('role', 'region');
      var inner = document.createElement('div'); inner.innerHTML = body.innerHTML; a.appendChild(inner);
      sheet.appendChild(q); sheet.appendChild(a);
      s.innerHTML = '<span class="rod top"></span>'; s.appendChild(sheet);
      s.insertAdjacentHTML('beforeend', '<span class="rod bot"></span>');
      q.addEventListener('click', function () { toggle(items, s); });
    });
    group.classList.add('ready');
  }
  function setOpen(s, open) {
    var a = s.querySelector('.a'), q = s.querySelector('.q');
    if (open === s.classList.contains('open')) return;
    s.classList.toggle('open', open); q.setAttribute('aria-expanded', open ? 'true' : 'false');
    a.style.height = (open ? 0 : a.scrollHeight) + 'px';
    requestAnimationFrame(function () { requestAnimationFrame(function () { a.style.height = (open ? a.scrollHeight : 0) + 'px'; }); });
    if (open) a.addEventListener('transitionend', function done(e) { if (e.propertyName === 'height') { a.style.height = 'auto'; a.removeEventListener('transitionend', done); } });
  }
  function toggle(items, s) {
    var opening = !s.classList.contains('open');
    items.forEach(function (o) { if (o !== s) setOpen(o, false); });
    setOpen(s, opening);
  }
  function init() { [].forEach.call(document.querySelectorAll('.scrolls'), build); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
