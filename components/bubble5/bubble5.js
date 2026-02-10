/**
 * Bubble5 展开态交互：长按默认态 → 展开态浮层
 * 与 bubble5.pen 中「Bubble5-默认态」「Bubble5-展开态」对应
 * 与其他 bubble 做法一致：500ms 长按，丝滑缩放过渡
 */
(function () {
  'use strict';

  var LONG_PRESS_MS = 500;
  var DEFAULT_ID = 'bubble5-default';
  var OVERLAY_ID = 'bubble5-overlay';
  var BACKDROP_ID = 'bubble5-backdrop';
  var EXPANDED_ID = 'bubble5-expanded';

  var longPressTimer = null;
  var didLongPress = false;

  var isEmbedMode = window.location.search.indexOf('embed=1') !== -1;

  function getDefaultEl() {
    return document.getElementById(DEFAULT_ID);
  }

  function getOverlay() {
    return document.getElementById(OVERLAY_ID);
  }

  function getExpandedEl() {
    return document.getElementById(EXPANDED_ID);
  }

  function getBackdrop() {
    return document.getElementById(BACKDROP_ID);
  }

  var VIDEO_ID = 'bubble5-expanded-video';

  function getExpandedVideo() {
    return document.getElementById(VIDEO_ID);
  }

  function getSlideContainer() {
    var expanded = getExpandedEl();
    return expanded ? expanded.querySelector('.bubble5__expanded-container') : null;
  }

  function showExpanded() {
    var defaultEl = getDefaultEl();
    var expanded = getExpandedEl();
    var overlay = getOverlay();
    if (!defaultEl || !expanded || !overlay) return;
    var rect = defaultEl.getBoundingClientRect();
    expanded.style.left = rect.left + 'px';
    expanded.style.top = rect.top + 'px';
    overlay.classList.add('is-visible');
    var container = getSlideContainer();
    if (container) container.classList.remove('is-pulled-out');
    var video = getExpandedVideo();
    if (video) {
      video.currentTime = 0;
      video.play().catch(function () {});
    }
    if (isEmbedMode && window.parent !== window) {
      try { window.parent.postMessage('bubble5-expanded', '*'); } catch (err) {}
    }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (container) container.classList.add('is-pulled-out');
      });
    });
  }

  function hideExpanded() {
    var overlay = getOverlay();
    if (overlay) overlay.classList.remove('is-visible');
    var container = getSlideContainer();
    if (container) container.classList.remove('is-pulled-out');
    var video = getExpandedVideo();
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    if (isEmbedMode && window.parent !== window) {
      try { window.parent.postMessage('bubble5-collapsed', '*'); } catch (err) {}
    }
  }

  function clearLongPressTimer() {
    if (longPressTimer !== null) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function onLongPressFired() {
    longPressTimer = null;
    didLongPress = true;
    var defaultEl = getDefaultEl();
    if (defaultEl) defaultEl.classList.remove('is-long-pressing');
    showExpanded();
  }

  function startLongPressTimer() {
    clearLongPressTimer();
    didLongPress = false;
    var defaultEl = getDefaultEl();
    if (defaultEl) defaultEl.classList.add('is-long-pressing');
    longPressTimer = setTimeout(onLongPressFired, LONG_PRESS_MS);
  }

  function cancelLongPress() {
    clearLongPressTimer();
    var defaultEl = getDefaultEl();
    if (defaultEl) defaultEl.classList.remove('is-long-pressing');
  }

  function onPointerDown(ev) {
    if (ev.button !== 0) return;
    didLongPress = false;
    startLongPressTimer();
    var defaultEl = getDefaultEl();
    if (defaultEl && ev.target && defaultEl.contains(ev.target)) {
      try { ev.target.setPointerCapture(ev.pointerId); } catch (e) {}
    }
  }

  function onPointerUp(ev) {
    if (ev.button !== 0) return;
    cancelLongPress();
    if (didLongPress) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  function onPointerCancel() {
    cancelLongPress();
  }

  function onPointerLeave() {
    cancelLongPress();
  }

  function onClick(ev) {
    if (didLongPress) {
      ev.preventDefault();
      ev.stopPropagation();
      didLongPress = false;
    }
  }

  function onContextMenu(ev) {
    var defaultEl = getDefaultEl();
    if (defaultEl && ev.target && defaultEl.contains(ev.target)) {
      ev.preventDefault();
    }
  }

  function init() {
    var defaultEl = getDefaultEl();
    var overlay = getOverlay();
    var backdrop = getBackdrop();
    if (!defaultEl) return;

    defaultEl.setAttribute('aria-label', '长按展开');
    defaultEl.addEventListener('pointerdown', onPointerDown, { passive: true });
    defaultEl.addEventListener('pointerup', onPointerUp, { capture: false });
    defaultEl.addEventListener('pointercancel', onPointerCancel, { passive: true });
    defaultEl.addEventListener('pointerleave', onPointerLeave, { passive: true });
    defaultEl.addEventListener('click', onClick, { capture: true });
    defaultEl.addEventListener('contextmenu', onContextMenu, { passive: false });

    if (backdrop) {
      backdrop.addEventListener('click', function (ev) {
        ev.stopPropagation();
        hideExpanded();
      });
    }
    if (overlay) {
      overlay.addEventListener('click', function (ev) {
        if (ev.target === overlay || ev.target === backdrop) {
          hideExpanded();
        }
      });
    }
    var expanded = getExpandedEl();
    if (expanded) {
      expanded.addEventListener('click', function (ev) {
        ev.stopPropagation();
      });
    }
  }

  if (isEmbedMode) {
    document.documentElement.classList.add('bubble5-embed');
    document.body.classList.add('embed-mode');
  }

  window.addEventListener('message', function (e) {
    if (e.data === 'collapse') {
      hideExpanded();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(init, 0);
    });
  } else {
    setTimeout(init, 0);
  }

  window.Bubble5 = {
    showExpanded: showExpanded,
    hideExpanded: hideExpanded
  };
})();
