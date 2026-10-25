/* ------------------------------------------------------------------
   Portfolio runtime: content rendering, disclosures, scroll state and
   the bug-catcher companion.
   ------------------------------------------------------------------ */

(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var CHECK = '<svg aria-hidden="true" width="13" height="13" viewBox="0 0 13 13">' +
    '<path d="M1.5 7 L5 10.5 L11.5 2.5" fill="none" stroke="#17191c" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

  var BUG_SVG = '<svg aria-hidden="true" width="14" height="12" viewBox="0 0 14 12">' +
    '<ellipse cx="7" cy="7.5" rx="3.8" ry="4.2" fill="#d6402b"></ellipse>' +
    '<circle cx="7" cy="2.6" r="2" fill="#d6402b"></circle>' +
    '<path d="M3.4 5.6 L0.8 4 M3.4 9 L0.8 10.4 M10.6 5.6 L13.2 4 M10.6 9 L13.2 10.4" stroke="#d6402b" stroke-width="1"></path>' +
    '</svg>';

  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia('(hover: none)').matches;

  /* ---------------------------------------------------------------- state */

  var state = {
    narrow: false, mid: false, big: false,
    scrolled: false, active: null,
    open: {}, bubble: null, jN: {}, bugN: 0, clicks: 0,
    section: 'hero', inHero: true, dir: 'down', walking: false, frame: 0,
    blink: false, widen: false, slip: false, hop: false,
    footer: false, rowHover: false, emailHover: false, idleWatch: false,
    bugState: 'net', hidden: false, shownOnce: false, docked: false
  };

  var pending = false;
  function setState(patch) {
    var changed = false;
    for (var k in patch) {
      if (state[k] !== patch[k]) { state[k] = patch[k]; changed = true; }
    }
    if (!changed || pending) return;
    pending = true;
    requestAnimationFrame(function () { pending = false; render(); });
  }

  /* ----------------------------------------------------------- rendering */

  function branchPaths(p) {
    var mid = 5.75;
    return p.branches.map(function (_, i) {
      var y = mid + i * ROW;
      return i === 0
        ? 'M0 ' + mid + ' H40'
        : 'M0 ' + mid + ' C22 ' + mid + ' 18 ' + y + ' 40 ' + y;
    });
  }

  function projectHTML(p, pi) {
    var hasB = p.branches.length > 0;
    var h = '';

    h += '<article class="project" data-pi="' + pi + '">';

    h += '<div class="project-head">' +
      '<span class="project-num">' + String(pi + 1).padStart(2, '0') + '</span>' +
      '<h3 class="project-name">' + esc(p.name) + '</h3>' +
      '</div>';

    h += '<p class="project-result">' + CHECK + '<span>' + esc(p.result) + '</span></p>';
    h += '<p class="project-context">' + esc(p.context) + '</p>';

    h += '<p class="project-tags">' + p.tags.map(function (t, i) {
      return (i > 0 ? '<span aria-hidden="true">&middot;</span>' : '') + '<span class="nw">' + esc(t) + '</span>';
    }).join('') + '</p>';

    /* The flow is a real ordered list, not a role="img" blob: screen readers
       then get the steps and the count, and the bug button inside it stays
       reachable (role="img" collapses everything under it). */
    h += '<div id="flow-' + pi + '">';

    /* wide flow */
    h += '<ol class="flow-wide" aria-label="Flow">';
    p.stations.forEach(function (s, i) {
      var line = i < p.stations.length - 1 || hasB;
      h += '<li class="station">' +
        '<div class="station-rail">' +
        (line ? '<div class="station-line"></div>' : '') +
        '<div class="flow-dot"></div>' +
        (i === p.bug
          ? '<span class="bug" data-bug="' + pi + '">' +
            '<span class="bubble-slot" data-bubble="bug' + pi + '"></span>' +
            '<button type="button" class="bug-btn" data-bugbtn="1" data-pose="bug' + pi + '" ' +
            'aria-label="A caught bug. Hover or click for its report">' + BUG_SVG + '</button>' +
            '</span>'
          : '') +
        '</div>' +
        '<div class="station-label">' + esc(s) + '</div>' +
        '</li>';
    });
    if (hasB) {
      var bh = Math.max(1, p.branches.length) * ROW;
      h += '<li class="branches">' +
        '<svg aria-hidden="true" width="40" height="' + bh + '" viewBox="0 0 40 ' + bh + '">' +
        branchPaths(p).map(function (d) {
          return '<path d="' + d + '" fill="none" stroke="#17191c" stroke-width="1.5"></path>';
        }).join('') +
        '</svg>' +
        '<ol class="branch-list" aria-label="Then one of">' +
        p.branches.map(function (b) {
          return '<li class="branch"><div class="dot-static"></div><div class="branch-label">' + esc(b) + '</div></li>';
        }).join('') +
        '</ol>' +
        '</li>';
    }
    h += '</ol>';

    /* narrow flow */
    h += '<ol class="flow-narrow" aria-label="Flow">';
    p.stations.forEach(function (s, i) {
      var line = i < p.stations.length - 1 || hasB;
      h += '<li class="nstation">' +
        '<div class="nstation-rail">' +
        '<div class="dot-static"></div>' +
        (line ? '<div class="nstation-line"></div>' : '') +
        (i === p.bug ? '<span class="nbug" data-nbug="' + pi + '">' + BUG_SVG + '</span>' : '') +
        '</div>' +
        '<div class="nstation-label">' + esc(s) + '</div>' +
        '</li>';
    });
    if (hasB) {
      h += '<li class="nbranches"><ol class="branch-list" aria-label="Then one of">' +
        p.branches.map(function (b) {
          return '<li class="nbranch">' +
            '<svg aria-hidden="true" width="26" height="22" viewBox="0 0 26 22">' +
            '<path d="M0.75 0 C0.75 14 8 20 26 20" fill="none" stroke="#17191c" stroke-width="1.5"></path></svg>' +
            '<div class="dot-static"></div>' +
            '<div class="branch-label">' + esc(b) + '</div>' +
            '</li>';
        }).join('') +
        '</ol></li>';
    }
    h += '</ol>';

    h += '</div>'; /* /flow */

    h += '<button type="button" class="disclosure" data-toggle="p' + pi + '" aria-expanded="false" aria-controls="tested-' + pi + '">' +
      '<span>what i tested (' + p.tested.length + ')</span>' +
      '<span class="plus" aria-hidden="true">+</span>' +
      '</button>';

    h += '<div class="panel" id="tested-' + pi + '"><div><ol class="tested">' +
      p.tested.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') +
      '</ol></div></div>';

    h += '</article>';
    return h;
  }

  function skillHTML(entry, i) {
    var name = entry[0], items = entry[1];
    return '<div class="skill">' +
      '<h3><button type="button" class="skill-btn" data-toggle="s' + i + '" aria-expanded="false" aria-controls="skill-' + i + '">' +
      '<span class="skill-name">' + esc(name) + '</span>' +
      '<span class="skill-count">' + String(items.length).padStart(2, '0') + '</span>' +
      '<span class="skill-plus" aria-hidden="true">+</span>' +
      '</button></h3>' +
      '<div class="panel" id="skill-' + i + '"><div>' +
      '<p class="skill-text">' + esc(items.join(' · ')) + '</p>' +
      '</div></div>' +
      '</div>';
  }

  $('#projects').innerHTML = PROJECTS.map(projectHTML).join('');
  $('#skills-list').innerHTML = SKILLS.map(skillHTML).join('');
  $('#exp-list').innerHTML = BULLETS.map(function (b) {
    return '<li>' + CHECK + '<span>' + esc(b) + '</span></li>';
  }).join('');

  /* -------------------------------------------------------- disclosures */

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-toggle]');
    if (!btn) return;
    var key = btn.getAttribute('data-toggle');
    var open = !state.open[key];
    var next = {};
    for (var k in state.open) next[k] = state.open[k];
    next[key] = open;
    state.open = next;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (panel) panel.classList.toggle('is-open', open);
  });

  /* ---------------------------------------------------- project row hover */

  $$('.project').forEach(function (el) {
    el.addEventListener('mouseenter', function () { if (!touch) setState({ rowHover: true }); });
    el.addEventListener('mouseleave', function () { setState({ rowHover: false }); });
  });

  /* ------------------------------------------------------------ companion */

  var comp = $('#comp');
  var inner = $('#comp-inner');
  var bubEl = $('#comp-bubble');
  var svg = $('#comp-svg');
  var figure = $('#comp-figure');
  var head = $('#comp-head');
  var eyes = $('#comp-eyes');
  var glasses = $('#comp-glasses');
  var legs = $('#comp-legs');
  var netBug = $('#net-bug');
  var expBug = $('#exp-bug');
  var pupils = svg.querySelector('[data-pupils]');
  var heroAnchor = $('#hero-anchor');
  var contactAnchor = $('#contact-anchor');
  var foot = $('#foot');
  var bar = $('#bar');
  var hideBtn = $('#comp-hide');

  var scale = 1;
  var lastX = 0;
  var lastY = 0;
  var lastMouse = null;
  var lastMode;
  var lastHero;
  var fastDone = false;
  var idleDone = false;
  var timers = {};

  function pose() {
    if (state.inHero) return 'hero';
    if (state.docked || (state.footer && state.section === 'contact')) return 'contact';
    return SEC_POSE[state.section] || 'hero';
  }
  function poseBase() {
    if (state.inHero) return 'hero';
    if (state.docked) return 'contact';
    return SEC_POSE[state.section] || 'hero';
  }
  function gesture() {
    if (state.emailHover) return 'point';
    if (state.idleWatch) return 'watch';
    if (state.footer && !state.inHero && !state.docked && poseBase() !== 'contact') return 'thumbs';
    return null;
  }
  function mirrored() {
    return !rm && state.dir === 'up' && !gesture() && pose() !== 'contact';
  }

  function applyInner() {
    var hop = state.hop && !rm ? -3 / (scale || 1) : 0;
    inner.style.transform = 'translateY(' + hop + 'px) scaleX(' + (mirrored() ? -1 : 1) + ')';
  }

  function lookOverride() {
    var g = gesture();
    if (g === 'point' || (state.rowHover && !g)) return [-2, 0];
    if (g === 'watch' || g === 'thumbs') return [-1.5, 1.5];
    return null;
  }

  function aim() {
    if (!pupils) return;
    var s = scale || 1, mir = mirrored(), ov = lookOverride();
    var dx = 0, dy = 0;
    if (ov) { dx = ov[0]; dy = ov[1]; }
    else if (lastMouse && !rm && !touch) {
      var r = svg.getBoundingClientRect();
      var cx = mir ? r.right - 70 * s : r.left + 70 * s;
      var cy = r.top + 64 * s;
      var mx = lastMouse.x - cx, my = lastMouse.y - cy;
      var d = Math.hypot(mx, my) || 1;
      var k = Math.min(2, d / 60) / d;
      dx = mx * k; dy = my * k;
    }
    var ux = dx / s, uy = dy / s;
    var L = Math.hypot(ux, uy), max = 2.3;
    if (L > max) { ux *= max / L; uy *= max / L; }
    if (mir) ux = -ux;
    pupils.setAttribute('transform', 'translate(' + ux.toFixed(2) + ' ' + uy.toFixed(2) + ')');
  }

  /* Positions the speech bubble against wherever the figure currently is.
     Called from place() and again from render(), because the bubble's height
     is only known once its lines are in the DOM. */
  function placeBubble() {
    if (!bubEl) return;
    var W = document.documentElement.clientWidth;
    var s = scale || 1;
    var bx = Math.min(W - 296, Math.max(12, lastX + 160 * s - 284));
    var box = bubEl.firstElementChild;
    var bh = box ? box.offsetHeight : 0;
    /* On a phone he stands just below the sticky header, so a bubble drawn
       above him lands behind it — speak downward instead. */
    var below = bh > 0 && lastY - 10 - bh < (bar ? bar.offsetHeight : 56) + 8;
    bubEl.classList.toggle('is-below', below);
    bubEl.style.transform =
      'translate(' + bx + 'px,' + (below ? lastY + 220 * s + 10 : lastY - 10) + 'px)';
    /* point the tail at his head, which sits at 70/160 across the figure */
    var tail = (bx + 284) - (lastX + 70 * s);
    bubEl.style.setProperty('--tail', Math.round(Math.min(196, Math.max(18, tail))) + 'px');
  }

  function place() {
    if (!comp || !heroAnchor) return;
    var W = document.documentElement.clientWidth;
    var H = document.documentElement.clientHeight;
    var narrow = W < 720;
    var ar = heroAnchor.getBoundingClientRect();
    var sy = window.scrollY;
    var docTop = ar.top + sy;

    var s0 = Math.max(24, docTop - 56 - ar.height * 0.15);
    var s1 = s0 + (narrow ? 200 : 280);
    var raw = Math.min(1, Math.max(0, (sy - s0) / (s1 - s0)));
    var t = rm ? (raw >= 0.5 ? 1 : 0) : raw * raw * (3 - 2 * raw);
    var inHero = t < 1;

    var cs = (narrow ? 64 : 96) / 220;
    var cw = 160 * cs, ch = 220 * cs;
    var m = narrow ? 16 : 20;
    var cx = W - m - cw;
    var cy = H - m - ch;

    if (foot) {
      var fr = foot.getBoundingClientRect();
      if (fr.top < cy + ch + 8) cy = Math.max(64, fr.top - ch - 8);
    }

    var cr = contactAnchor && contactAnchor.getBoundingClientRect();
    var docked = !inHero && !!cr && cr.width > 0 && cr.top < H - 40 && cr.bottom > 70;

    var s, x, y;
    if (docked) {
      s = cr.width / 160; x = cr.left; y = cr.top;
    } else {
      var hs = ar.width / 160;
      s = hs + (cs - hs) * t;
      x = ar.left + (cx - ar.left) * t;
      y = ar.top + (cy - ar.top) * t - Math.sin(t * Math.PI) * 48;
    }

    if (docked !== state.docked) setState({ docked: docked });

    var mode = docked ? 'dock' : 'free';
    if (mode !== lastMode) {
      if (lastMode !== undefined && !rm) {
        comp.style.transition = 'transform 250ms ease-out';
        clearTimeout(timers.tr);
        timers.tr = setTimeout(function () { comp.style.transition = 'none'; }, 260);
      }
      lastMode = mode;
    }

    if (inHero !== lastHero) {
      lastHero = inHero;
      setState({ inHero: inHero, bugState: !inHero && state.bugState === 'net' ? 'escaped' : state.bugState });
    }

    comp.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')';
    scale = s;

    lastX = x;
    lastY = y;
    placeBubble();

    applyInner();
    aim();
  }

  /* --------------------------------------------------------- speech */

  var SPEAKER = /^(dev|me): /;

  function bubbleHTML(lines) {
    return '<div class="bubble">' + lines.map(function (l) {
      var m = SPEAKER.exec(l);
      if (!m) return '<span>' + esc(l) + '</span>';
      /* set the speaker back so the exchange reads as two voices */
      return '<span><span class="who">' + esc(m[1]) + ':</span> ' +
        esc(l.slice(m[0].length)) + '</span>';
    }).join('') + '</div>';
  }

  function say(lines, posture) {
    posture = posture || 'comp';
    setState({ bubble: { pose: posture, lines: lines }, shownOnce: state.shownOnce || posture === 'comp' });
    clearTimeout(timers.bub);
    timers.bub = setTimeout(function () {
      if (state.bubble && state.bubble.lines === lines) setState({ bubble: null });
    }, 4000);
  }

  function nextJoke() {
    var key = pose();
    if (key === 'contact' && state.clicks < 2) return;
    var list = SETS[key];
    var n = state.jN[key] || 0;
    var line = list[n % list.length];
    var jn = {};
    for (var k in state.jN) jn[k] = state.jN[k];
    jn[key] = n + 1;
    state.jN = jn;
    say(Array.isArray(line) ? line : [line]);
  }

  function showBug(posture, force) {
    if (!force && state.bubble && state.bubble.pose === posture) return;
    var n = state.bugN;
    setState({ bugN: n + 1 });
    say([BUG_J[n % BUG_J.length]], posture);
  }

  /* --------------------------------------------------------- bug buttons */

  $$('[data-bugbtn]').forEach(function (btn) {
    var posture = btn.getAttribute('data-pose');
    var enter = function () { showBug(posture); };
    var close = function () {
      if (state.bubble && state.bubble.pose !== 'comp') setState({ bubble: null });
    };
    btn.addEventListener('mouseenter', enter);
    btn.addEventListener('focus', enter);
    btn.addEventListener('click', function () { showBug(posture, true); });
    btn.addEventListener('mouseleave', close);
    btn.addEventListener('blur', close);
  });

  /* ----------------------------------------------------------- companion UI */

  $('#comp-btn').addEventListener('mouseenter', function () {
    if (touch) return;
    setState({ hop: true, blink: true });
    setTimeout(function () { setState({ hop: false, blink: false }); }, 180);
    nextJoke();
    clearTimeout(timers.long);
    timers.long = setTimeout(function () { say(['you can click me, you know.']); }, 3000);
  });
  $('#comp-btn').addEventListener('mouseleave', function () { clearTimeout(timers.long); });
  $('#comp-btn').addEventListener('click', function () {
    clearTimeout(timers.long);
    poke();
    if (pose() === 'contact' && !gesture() && state.clicks < 2) {
      var c = state.clicks;
      setState({ clicks: c + 1 });
      say([CONTACT_J[Math.min(c, 1)]]);
    } else nextJoke();
  });

  hideBtn.addEventListener('click', function () {
    setState({ hidden: true, bubble: null });
    try { sessionStorage.setItem('vc-companion-hidden', '1'); } catch (e) {}
  });

  var emailLink = $('#email-link');
  ['mouseenter', 'focus'].forEach(function (ev) {
    emailLink.addEventListener(ev, function () { if (!touch) setState({ emailHover: true }); });
  });
  ['mouseleave', 'blur'].forEach(function (ev) {
    emailLink.addEventListener(ev, function () { setState({ emailHover: false }); });
  });

  /* ------------------------------------------------- résumé preview */

  var cvModal = $('#cv-modal');
  var cvFrame = $('#cv-frame');
  var cvHref = cvFrame.getAttribute('data-src');

  /* Phones and tablets don't render PDFs in an iframe — they'd get an empty
     panel — so hand the file straight to the browser's own viewer instead. */
  var cvInline = !window.matchMedia('(hover: none) and (pointer: coarse)').matches &&
    typeof cvModal.showModal === 'function';

  function cvOpen() {
    if (!cvInline) { window.open(cvHref, '_blank', 'noopener'); return; }
    /* mount the PDF on first open so it isn't fetched with the page */
    if (!cvFrame.getAttribute('src')) cvFrame.setAttribute('src', cvHref);
    setState({ bubble: null });
    cvModal.showModal();
    document.documentElement.classList.add('is-locked');
  }

  function cvClose() {
    if (cvModal.open) cvModal.close();
  }

  $$('[data-cv-open]').forEach(function (btn) {
    btn.addEventListener('click', cvOpen);
  });
  $('#cv-close').addEventListener('click', cvClose);
  /* the padding around the panel belongs to the dialog itself */
  cvModal.addEventListener('click', function (e) {
    if (e.target === cvModal) cvClose();
  });
  /* fires for the close button and for Escape, which the dialog handles */
  cvModal.addEventListener('close', function () {
    document.documentElement.classList.remove('is-locked');
  });

  /* ---------------------------------------------------------------- render */

  function render() {
    /* header + nav */
    bar.classList.toggle('is-scrolled', state.scrolled);
    $$('[data-nav]').forEach(function (a) {
      var on = a.getAttribute('data-nav') === state.active;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    });

    /* bug markers */
    $$('[data-bug]').forEach(function (el) {
      var pi = +el.getAttribute('data-bug');
      var vis = pi === 0 ? state.bugState !== 'net' : true;
      el.classList.toggle('is-hidden', !vis);
      el.classList.toggle('is-caught', pi === 0 && state.bugState === 'caught' && !rm);
    });
    $$('[data-nbug]').forEach(function (el) {
      var pi = +el.getAttribute('data-nbug');
      el.classList.toggle('is-hidden', pi === 0 && state.bugState === 'net');
    });

    /* bubbles */
    var b = state.bubble;
    $$('[data-bubble]').forEach(function (slot) {
      var on = !!b && b.pose === slot.getAttribute('data-bubble');
      slot.innerHTML = on ? bubbleHTML(b.lines) : '';
    });
    bubEl.innerHTML = b && b.pose === 'comp' ? bubbleHTML(b.lines) : '';
    placeBubble();

    /* companion visibility */
    comp.classList.toggle('is-hidden', state.hidden);
    bubEl.classList.toggle('is-hidden', state.hidden);
    hideBtn.classList.toggle('is-shown', state.narrow && state.shownOnce && !state.inHero && !state.hidden);

    /* pose */
    var p = pose(), g = gesture(), mir = mirrored();
    var arm = g || (p === 'contact' ? (state.clicks >= 2 ? 'hero' : 'asleep') : p);
    var asleep = p === 'contact' && state.clicks === 0 && !g;

    var L = {
      hero: arm === 'hero' ? 1 : 0,
      case: arm === 'case' ? 1 : 0,
      skills: arm === 'skills' ? 1 : 0,
      exp: arm === 'exp' ? 1 : 0,
      asleep: arm === 'asleep' ? 1 : 0,
      point: arm === 'point' ? 1 : 0,
      thumbs: arm === 'thumbs' ? 1 : 0,
      watch: arm === 'watch' ? 1 : 0,
      key: p === 'contact' ? 1 : 0,
      floorNet: p === 'contact' && state.clicks < 2 && g !== 'point' ? 1 : 0,
      z: asleep ? 1 : 0,
      q: p === 'contact' && state.clicks === 1 && !g ? 1 : 0,
      eyes: asleep ? 0 : 1,
      closed: asleep ? 1 : 0
    };
    $$('[data-layer]').forEach(function (el) {
      var v = L[el.getAttribute('data-layer')];
      el.style.opacity = v === undefined ? 1 : v;
    });

    figure.style.transform = asleep ? 'rotate(10deg)' : 'rotate(0deg)';
    legs.setAttribute('d', (asleep || !state.walking || rm) ? LEGS.stand : (state.frame ? LEGS.a : LEGS.b));
    eyes.style.transform = state.blink ? 'scaleY(0.12)' : state.widen ? 'scale(1.35)' : 'scale(1)';
    glasses.style.transform = state.slip ? 'translateY(5px) rotate(5deg)' : 'translateY(0px) rotate(0deg)';
    head.style.transform = state.rowHover && !g ? (mir ? 'rotate(7deg)' : 'rotate(-7deg)') : 'rotate(0deg)';
    netBug.style.transform = state.bugState === 'escaped' && !rm ? 'translate(22px,-30px)' : 'translate(0px,0px)';
    netBug.style.opacity = state.bugState === 'escaped' ? 0 : 1;
    expBug.style.opacity = state.bugState === 'caught' ? 1 : 0;

    $('#comp-btn').setAttribute('aria-label', asleep
      ? 'Vikas, asleep on the Esc key. Click to wake him'
      : 'Vikas, the site’s bug catcher. Click for an edge case he’d check');

    applyInner();
    aim();
  }

  /* -------------------------------------------------------------- motion */

  var lastY = window.scrollY;
  var lastT = performance.now();

  function scrollMotion() {
    var y = window.scrollY, t = performance.now();
    var dy = y - lastY, dt = Math.max(1, t - lastT);
    lastY = y; lastT = t;

    var active = null;
    ['experience', 'work', 'skills', 'contact'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 160) active = id;
    });
    if (window.innerHeight + y >= document.documentElement.scrollHeight - 4) active = 'contact';

    setState({ scrolled: y > 4, active: active });

    if (dy === 0) return;
    setState({ dir: dy > 0 ? 'down' : 'up', walking: true });
    stepLegs();
    clearTimeout(timers.walk);
    timers.walk = setTimeout(function () { setState({ walking: false }); }, 150);

    var v = Math.abs(dy) / dt * 1000;
    if (v > 6000 && dt < 80 && !fastDone && !state.inHero && !state.hidden) {
      fastDone = true;
      setState({ slip: true });
      setTimeout(function () { setState({ slip: false }); }, 900);
      if (!state.narrow) say(['slow down, i’m testing.']);
    }
    poke();
  }

  /* leg frames only tick while a scroll is actually in progress */
  function stepLegs() {
    if (timers.step || rm) return;
    timers.step = setTimeout(function () {
      timers.step = null;
      if (!state.walking) return;
      setState({ frame: 1 - state.frame });
      stepLegs();
    }, 160);
  }

  function blinkLoop() {
    timers.blink = setTimeout(function () {
      setState({ blink: true });
      setTimeout(function () { setState({ blink: false }); }, 130);
      blinkLoop();
    }, 4000 + Math.random() * 3000);
  }

  function poke() {
    clearTimeout(timers.idle);
    if (idleDone) return;
    timers.idle = setTimeout(function () {
      if (state.hidden) return;
      idleDone = true;
      setState({ idleWatch: true });
      setTimeout(function () { setState({ idleWatch: false }); }, 4000);
      say(['still waiting on the build.']);
    }, 15000);
  }

  /* --------------------------------------------------------- observers */

  var catchT = null;

  function observe() {
    var ids = ['hero', 'work', 'skills', 'experience', 'contact'];
    var els = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if (els.length < ids.length || !foot) { setTimeout(observe, 400); return; }

    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setState({ section: e.target.id }); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    els.forEach(function (el) { io.observe(el); });

    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) { setState({ footer: e.isIntersecting }); });
    }, { threshold: 0.6 });
    io2.observe(foot);

    var flow = document.getElementById('flow-0');
    if (flow) {
      var io3 = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting && state.bugState === 'escaped' && !catchT) {
            catchT = setTimeout(function () { setState({ bugState: 'caught' }); }, 800);
          }
        });
      }, { threshold: 0.6 });
      io3.observe(flow);
    }
  }

  /* ------------------------------------------------------------- wiring */

  function onResize() {
    var w = window.innerWidth;
    setState({ narrow: w < 720, mid: w >= 720 && w < 1000, big: w >= 1200 });
    place();
  }

  /* place() measures then writes transforms; once per frame is plenty and it
     keeps a fast scroll on a cheap phone from thrashing layout */
  function queuePlace() {
    if (timers.place) return;
    timers.place = requestAnimationFrame(function () {
      timers.place = 0;
      place();
    });
  }

  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', function () { scrollMotion(); queuePlace(); }, { passive: true });
  window.addEventListener('mousemove', function (e) {
    lastMouse = { x: e.clientX, y: e.clientY };
    poke();
    aim();
  });
  document.addEventListener('mouseout', function (e) {
    if (e.relatedTarget || touch) return;
    setState({ widen: true });
    clearTimeout(timers.widen);
    timers.widen = setTimeout(function () { setState({ widen: false }); }, 600);
  });
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (state.bubble && !comp.contains(t) && !(t.closest && t.closest('[data-bugbtn]'))) {
      setState({ bubble: null });
    }
    poke();
  });
  document.addEventListener('keydown', poke);

  if (window.ResizeObserver) {
    new ResizeObserver(queuePlace).observe(document.body);
  }

  try {
    if (sessionStorage.getItem('vc-companion-hidden') === '1') state.hidden = true;
  } catch (e) {}

  comp.style.transition = 'none';
  blinkLoop();
  poke();
  onResize();
  scrollMotion();
  place();
  render();
  observe();

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  window.addEventListener('load', place);

  console.log('found a bug? assign it to vikas06cs@gmail.com');
})();
