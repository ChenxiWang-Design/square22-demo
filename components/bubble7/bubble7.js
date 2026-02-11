/**
 * Bubble7 交互：长按默认态 → 展开态浮层
 * 使用 SVG 文件：默认态 158×178，展开态 223×274
 */
(function () {
  var LONG_PRESS_MS = 500;
  var DEFAULT_ID = "bubble7-default";
  var OVERLAY_ID = "bubble7-overlay";
  var BACKDROP_ID = "bubble7-backdrop";
  var EXPANDED_ID = "bubble7-expanded";

  var longPressTimer = null;
  var didLongPress = false;

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

  function showExpanded() {
    var defaultEl = getDefaultEl();
    var expanded = getExpandedEl();
    var overlay = getOverlay();
    if (!defaultEl || !expanded || !overlay) return;
    var rect = defaultEl.getBoundingClientRect();
    // 对齐默认态的左上角：展开态从默认态的左上角开始
    // transform-origin: left top，所以直接使用默认态的左上角位置即可
    expanded.style.left = rect.left + "px";
    expanded.style.top = rect.top + "px";
    overlay.classList.add("is-visible");
    if (document.documentElement.classList.contains("bubble7-embed") && window.parent !== window) {
      try { window.parent.postMessage("bubble7-expanded", "*"); } catch (err) {}
    }
  }

  function hideExpanded() {
    var overlay = getOverlay();
    if (overlay) overlay.classList.remove("is-visible");
    if (document.documentElement.classList.contains("bubble7-embed") && window.parent !== window) {
      try { window.parent.postMessage("bubble7-collapsed", "*"); } catch (err) {}
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
    if (defaultEl) defaultEl.classList.remove("is-long-pressing");
    showExpanded();
  }

  function startLongPressTimer() {
    clearLongPressTimer();
    didLongPress = false;
    var defaultEl = getDefaultEl();
    if (defaultEl) defaultEl.classList.add("is-long-pressing");
    longPressTimer = setTimeout(onLongPressFired, LONG_PRESS_MS);
  }

  function cancelLongPress(ev) {
    clearLongPressTimer();
    var defaultEl = getDefaultEl();
    if (defaultEl) defaultEl.classList.remove("is-long-pressing");
  }

  function onPointerDown(ev) {
    if (ev.button !== 0) return; /* 只响应主键 */
    didLongPress = false; /* 新一次按下时重置 */
    startLongPressTimer();
    var defaultEl = getDefaultEl();
    if (defaultEl && ev.target && defaultEl.contains(ev.target)) {
      try {
        ev.target.setPointerCapture(ev.pointerId);
      } catch (e) {}
    }
  }

  function onPointerUp(ev) {
    if (ev.button !== 0) return;
    cancelLongPress(ev);
    if (didLongPress) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    /* didLongPress 在 onClick 中清除，以便阻止长按后的点击 */
  }

  function onPointerCancel(ev) {
    cancelLongPress(ev);
  }

  function onPointerLeave(ev) {
    /* 指针移出默认态区域时取消长按计时 */
    cancelLongPress(ev);
  }

  function onClick(ev) {
    /* 若刚触发过长按，阻止点击（避免误触关闭等） */
    if (didLongPress) {
      ev.preventDefault();
      ev.stopPropagation();
      didLongPress = false;
    }
  }

  function onContextMenu(ev) {
    /* 长按可能触发右键菜单，若在默认态上则阻止 */
    var defaultEl = getDefaultEl();
    if (defaultEl && ev.target && defaultEl.contains(ev.target)) {
      ev.preventDefault();
    }
  }

  function init() {
    var defaultEl = getDefaultEl();
    var backdrop = getBackdrop();
    if (!defaultEl) return;

    defaultEl.addEventListener("pointerdown", onPointerDown, { passive: true });
    defaultEl.addEventListener("pointerup", onPointerUp, { capture: false });
    defaultEl.addEventListener("pointercancel", onPointerCancel, { passive: true });
    defaultEl.addEventListener("pointerleave", onPointerLeave, { passive: true });
    defaultEl.addEventListener("click", onClick, { capture: true });
    defaultEl.addEventListener("contextmenu", onContextMenu, { passive: false });

    if (backdrop) {
      backdrop.addEventListener("click", function () {
        hideExpanded();
      });
    }
  }

  function runInit() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        setTimeout(init, 0);
      });
    } else {
      setTimeout(init, 0);
    }
  }

  if (typeof window !== "undefined" && window.location.search.indexOf("embed=1") !== -1) {
    document.documentElement.classList.add("bubble7-embed");
  }
  window.addEventListener("message", function (e) {
    if (e.data === "collapse") {
      hideExpanded();
    }
  });
  runInit();

  window.Bubble7 = {
    showExpanded: showExpanded,
    hideExpanded: hideExpanded
  };
})();
