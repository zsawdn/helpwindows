/* helpwindows 纯静态站交互脚本：导航下拉 / 移动端抽屉 / 滚动固定导航 */
(function () {
  'use strict';

  function closest(node, sel) {
    while (node && node.nodeType === 1) {
      if (node.matches ? node.matches(sel) : false) return node;
      node = node.parentNode;
    }
    return null;
  }

  /* ---------- 桌面导航下拉 ---------- */
  var dropdowns = document.querySelectorAll('.s-navbar-dropdown, .s-nav-dropdown');

  function closeAll(except) {
    Array.prototype.forEach.call(document.querySelectorAll('.nav-dropdown-popover'), function (p) {
      if (except && except.contains(p)) return;
      p.classList.remove('is-open');
      p.style.top = ''; p.style.left = '';
    });
    Array.prototype.forEach.call(dropdowns, function (li) {
      if (except && li === except) return;
      li.classList.remove('_open');
      li.classList.remove('is-open');
    });
  }

  function openDropdown(li, trigger) {
    var panel = li.querySelector('.nav-dropdown-popover');
    if (!panel) return;
    closeAll(li);
    panel.classList.add('is-open');
    li.classList.add('_open');
    var r = trigger.getBoundingClientRect();
    var w = panel.offsetWidth || 240;
    var left = Math.min(r.left, Math.max(8, window.innerWidth - w - 16));
    panel.style.left = Math.max(8, left) + 'px';
    panel.style.top = (r.bottom + window.pageYOffset + 4) + 'px';
  }

  Array.prototype.forEach.call(dropdowns, function (li) {
    var trigger = li.querySelector('.located-dropdown-item .s-nav-dropdown-item') ||
                  li.querySelector('.s-nav-dropdown-item') ||
                  li.querySelector('.located-dropdown-item');
    if (!trigger) return;
    trigger.addEventListener('mouseenter', function () { openDropdown(li, trigger); });
    li.addEventListener('mouseleave', function () {
      var p = li.querySelector('.nav-dropdown-popover');
      if (p) { p.classList.remove('is-open'); p.style.top = ''; p.style.left = ''; }
      li.classList.remove('_open');
    });
    trigger.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var panel = li.querySelector('.nav-dropdown-popover');
      if (panel && panel.classList.contains('is-open')) {
        panel.classList.remove('is-open'); li.classList.remove('_open');
      } else { openDropdown(li, trigger); }
    });
  });

  document.addEventListener('click', function (e) {
    if (!closest(e.target, '.s-navbar-dropdown') && !closest(e.target, '.s-nav-dropdown')) closeAll(null);
  });
  window.addEventListener('resize', function () { closeAll(null); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeAll(null); document.body.classList.remove('drawer-open'); }
  });

  /* ---------- 移动端抽屉 ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.navbar-drawer-bar'), function (bar) {
    bar.addEventListener('click', function (e) {
      e.preventDefault();
      document.body.classList.toggle('drawer-open');
    });
  });
  var mask = document.getElementById('navbar-drawer-mask');
  if (mask) mask.addEventListener('click', function () { document.body.classList.remove('drawer-open'); });
  Array.prototype.forEach.call(document.querySelectorAll('.navbar-drawer-dropdown'), function (dd) {
    var head = dd.querySelector('.s-mobile-nav-dropdown-item');
    if (!head) return;
    head.addEventListener('click', function (e) { e.preventDefault(); dd.classList.toggle('is-open'); });
  });

  /* ---------- 文章分享按钮 ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-share]'), function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var u = encodeURIComponent(window.location.href);
      var ttl = encodeURIComponent(document.title);
      var net = btn.getAttribute('data-share');
      var map = {
        linkedin: 'https://www.linkedin.com/shareArticle?mini=true&url=' + u + '&title=' + ttl,
        facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + u,
        twitter: 'https://twitter.com/intent/tweet?url=' + u + '&text=' + ttl
      };
      var href = map[net] || map.linkedin;
      window.open(href, 'share', 'width=500,height=500,scrollbars=yes,resizable=yes');
    });
  });

  /* ---------- 滚动时固定导航 ---------- */
  var nav = document.querySelector('.s-navbar-desktop');
  if (nav) {
    var onScroll = function () {
      if (window.pageYOffset > 60) nav.classList.add('nav-scrolled');
      else nav.classList.remove('nav-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
