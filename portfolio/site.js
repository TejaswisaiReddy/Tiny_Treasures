(function(){
  var D = window.PAGE || {};
  var $ = function(s,r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };

  /* copy email */
  $('[data-copy]').forEach(function(b){
    b.addEventListener('click', function(e){
      e.preventDefault();
      if (navigator.clipboard) { try { navigator.clipboard.writeText(D.email||''); } catch(err){} }
      var span = b.querySelector('[data-b="navLabel"]') || b;
      var old = span.textContent;
      span.textContent = 'Copied to clipboard ✓';
      setTimeout(function(){ span.textContent = old; }, 1800);
    });
  });

  /* prototype walkthrough */
  var demo = D.demo || [];
  if (demo.length) {
    var screens = $('.dscr'), dots = $('.ddot'), steps = $('.wstep');
    var cur = 0, playing = true, timer = null;
    function paint(){
      screens.forEach(function(el,i){
        el.classList.remove('on','prev');
        if (i === cur) el.classList.add('on');
        else if (i === (cur - 1 + demo.length) % demo.length) el.classList.add('prev');
      });
      dots.forEach(function(d,i){ d.classList.toggle('on', i === cur); });
      steps.forEach(function(s,i){ s.classList.toggle('on', i === cur); });
      $('[data-b="demoCap"]').forEach(function(n){ n.textContent = demo[cur].cap; });
      $('[data-b="demoNum"]').forEach(function(n){ n.textContent = cur + 1; });
      $('[data-b="playLabel"]').forEach(function(n){ n.textContent = playing ? 'Pause' : 'Play'; });
    }
    function restart(){
      var el = screens[cur]; if (!el) return;
      [el.querySelector('img'), el.querySelector('.tap')].forEach(function(n){
        if (!n) return; n.style.animation = 'none'; void n.offsetWidth; n.style.animation = '';
      });
    }
    function go(i, stop){
      cur = (i + demo.length) % demo.length;
      if (stop) { playing = false; clearInterval(timer); }
      paint(); restart();
    }
    $('[data-step]').forEach(function(b){
      b.addEventListener('click', function(){ go(parseInt(b.getAttribute('data-step'),10), true); });
    });
    $('[data-toggle]').forEach(function(b){
      b.addEventListener('click', function(){
        playing = !playing; clearInterval(timer);
        if (playing) timer = setInterval(function(){ if (playing) go(cur+1); }, 3800);
        paint();
      });
    });
    timer = setInterval(function(){ if (playing) go(cur+1); }, 3800);
    paint();
  }

  /* artefact tabs */
  var arts = D.arts || [];
  if (arts.length) {
    $('[data-tab]').forEach(function(b){
      b.addEventListener('click', function(){
        var i = parseInt(b.getAttribute('data-tab'),10), a = arts[i];
        if (!a) return;
        $('[data-tab]').forEach(function(x,xi){ x.classList.toggle('on', xi === i); });
        $('[data-b-src="art"]').forEach(function(img){
          img.src = a.src; img.alt = a.alt || '';
          var fig = img.closest('figure');
          if (fig) { fig.classList.remove('fade'); void fig.offsetWidth; fig.classList.add('fade'); }
        });
        $('[data-b="artCap"]').forEach(function(n){ n.textContent = a.cap || ''; });
      });
    });
  }

  /* lightbox */
  var lb = D.lb || [], root = document.getElementById('lb-root');
  if (lb.length && root) {
    var at = 0;
    function show(i){
      at = (i + lb.length) % lb.length;
      $('[data-b-src="lb"]', root).forEach(function(img){ img.src = lb[at].src; img.alt = lb[at].label || ''; });
      $('[data-b="lbLabel"]', root).forEach(function(n){ n.textContent = lb[at].label || ''; });
      $('[data-b="lbPos"]', root).forEach(function(n){ n.textContent = (at+1) + ' / ' + lb.length; });
      root.hidden = false; document.body.style.overflow = 'hidden';
    }
    function hide(){ root.hidden = true; document.body.style.overflow = ''; }
    $('[data-lb]').forEach(function(b){
      b.addEventListener('click', function(e){ e.preventDefault(); show(parseInt(b.getAttribute('data-lb'),10)); });
    });
    $('[data-lbprev]', root).forEach(function(b){ b.addEventListener('click', function(e){ e.stopPropagation(); show(at-1); }); });
    $('[data-lbnext]', root).forEach(function(b){ b.addEventListener('click', function(e){ e.stopPropagation(); show(at+1); }); });
    $('[data-lbclose]', root).forEach(function(b){ b.addEventListener('click', function(e){ e.stopPropagation(); hide(); }); });
    root.addEventListener('click', function(e){
      if (e.target.tagName === 'IMG' || e.target.closest('button')) return;
      hide();
    });
    document.addEventListener('keydown', function(e){
      if (root.hidden) return;
      if (e.key === 'Escape') hide();
      if (e.key === 'ArrowLeft') show(at-1);
      if (e.key === 'ArrowRight') show(at+1);
    });
  }
})();
