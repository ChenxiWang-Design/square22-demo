/**
 * Bubble3 交互：长按默认态 → 展开态浮层
 * 与 bubble3.pen 中「Bubble3-默认态」「Bubble3-展开态」对应
 */
(function () {
  var LONG_PRESS_MS = 250;
  var DEFAULT_ID = "bubble3-default";
  var OVERLAY_ID = "bubble3-overlay";
  var BACKDROP_ID = "bubble3-backdrop";
  var EXPANDED_ID = "bubble3-expanded";

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

  var PHASE1_DURATION_MS = 500;
  var expandedCard = null;
  var expandedPhotosTrack = null;
  var phase2Timer = null;

  function getExpandedCard() {
    if (!expandedCard) expandedCard = document.querySelector(".bubble3__expanded-card");
    return expandedCard;
  }

  function getExpandedPhotosTrack() {
    if (!expandedPhotosTrack) expandedPhotosTrack = document.getElementById("bubble3-photos-track");
    return expandedPhotosTrack;
  }

  function showExpanded() {
    var defaultEl = getDefaultEl();
    var expanded = getExpandedEl();
    var overlay = getOverlay();
    var card = getExpandedCard();
    var track = getExpandedPhotosTrack();
    if (!defaultEl || !expanded || !overlay) return;
    if (phase2Timer) clearTimeout(phase2Timer);
    if (card) {
      card.classList.remove("is-phase2");
    }
    if (track && overlay._bubble3ResetPhotos) overlay._bubble3ResetPhotos();
    var rect = defaultEl.getBoundingClientRect();
    expanded.style.left = rect.left + "px";
    expanded.style.top = rect.top + "px";
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
    phase2Timer = setTimeout(function () {
      phase2Timer = null;
      if (card) card.classList.add("is-phase2");
    }, PHASE1_DURATION_MS);
    if (document.documentElement.classList.contains("bubble3-embed") && window.parent !== window) {
      try { window.parent.postMessage("bubble3-expanded", "*"); } catch (err) {}
    }
  }

  function hideExpanded() {
    var overlay = getOverlay();
    var card = getExpandedCard();
    var track = getExpandedPhotosTrack();
    if (phase2Timer) {
      clearTimeout(phase2Timer);
      phase2Timer = null;
    }
    if (card) card.classList.remove("is-phase2");
    if (track && overlay._bubble3ResetPhotos) overlay._bubble3ResetPhotos();
    if (overlay) {
      overlay.classList.remove("is-visible");
      overlay.setAttribute("aria-hidden", "true");
    }
    if (document.documentElement.classList.contains("bubble3-embed") && window.parent !== window) {
      try { window.parent.postMessage("bubble3-collapsed", "*"); } catch (err) {}
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
    cancelLongPress(ev);
    if (didLongPress) {
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  function onPointerCancel(ev) {
    cancelLongPress(ev);
  }

  function onPointerLeave(ev) {
    cancelLongPress(ev);
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
    var backdrop = getBackdrop();
    if (!defaultEl) return;

    defaultEl.setAttribute("aria-label", "长按展开");
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
    initExpandedPhotosSwipe();
  }

  function initExpandedPhotosSwipe() {
    var overlay = getOverlay();
    var container = document.getElementById("bubble3-expanded-photos");
    var track = getExpandedPhotosTrack();
    var photoEls = track ? track.querySelectorAll(".bubble3__expanded-photo") : [];
    if (!overlay || !container || !track || photoEls.length === 0) return;

    var LONG_PRESS_MS = 150;
    var startX = 0;
    var startOffsetX = 0;
    var targetDragX = 0;
    var longPressTimer = null;
    var isDragMode = false;
    var TRANSLATE_MIN = -120;
    var TRANSLATE_MAX = 120;
    /** 跟手系数：0=领队立刻跟手指，1/2=跟随有延迟 */
    var FOLLOW_FACTOR = [1, 0.35, 0.18];
    var photoOffsets = [0, 0, 0];
    var settleId = null;
    var SETTLE_DURATION_MS = 1000;
    var settleStartTime = 0;
    var settleStartOffsets = [0, 0, 0];

    function clamp(v) {
      return Math.max(TRANSLATE_MIN, Math.min(TRANSLATE_MAX, v));
    }

    function applyOffsets() {
      for (var i = 0; i < photoEls.length && i < photoOffsets.length; i++) {
        photoEls[i].style.setProperty("--photo-drag-x", photoOffsets[i].toFixed(2) + "px");
      }
    }

    function tick() {
      var now = Date.now();
      if (settleStartTime > 0) {
        var elapsed = now - settleStartTime;
        if (elapsed >= SETTLE_DURATION_MS) {
          for (var i = 0; i < photoOffsets.length; i++) photoOffsets[i] = 0;
          applyOffsets();
          track.classList.remove("is-dragging");
          settleId = null;
          settleStartTime = 0;
          return;
        }
        var t = elapsed / SETTLE_DURATION_MS;
        t = 1 - (1 - t) * (1 - t);
        for (var i = 0; i < photoOffsets.length; i++) {
          photoOffsets[i] = settleStartOffsets[i] * (1 - t);
        }
        applyOffsets();
        settleId = requestAnimationFrame(tick);
        return;
      }
      for (var i = 0; i < photoOffsets.length; i++) {
        var factor = FOLLOW_FACTOR[i];
        photoOffsets[i] = photoOffsets[i] + (targetDragX - photoOffsets[i]) * factor;
      }
      applyOffsets();
      if (isDragMode) {
        settleId = requestAnimationFrame(tick);
      } else {
        settleId = null;
      }
    }

    function startSettle() {
      targetDragX = 0;
      if (settleId) {
        cancelAnimationFrame(settleId);
        settleId = null;
      }
      for (var i = 0; i < settleStartOffsets.length && i < photoOffsets.length; i++) {
        settleStartOffsets[i] = photoOffsets[i];
      }
      settleStartTime = Date.now();
      track.classList.add("is-dragging");
      settleId = requestAnimationFrame(tick);
    }

    function clearLongPressTimer() {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    }

    function isOverlayVisibleAndTargetInPhotos(ev) {
      return overlay.classList.contains("is-visible") && container.contains(ev.target);
    }

    function onPhotosPointerDown(ev) {
      if (!isOverlayVisibleAndTargetInPhotos(ev)) return;
      if (ev.button !== 0) return;
      ev.preventDefault();
      if (settleId) {
        cancelAnimationFrame(settleId);
        settleId = null;
        settleStartTime = 0;
      }
      isDragMode = false;
      clearLongPressTimer();
      targetDragX = photoOffsets[0];
      longPressTimer = setTimeout(function () {
        longPressTimer = null;
        isDragMode = true;
        startX = ev.clientX;
        startOffsetX = photoOffsets[0];
        track.classList.add("is-dragging");
        settleId = requestAnimationFrame(tick);
      }, LONG_PRESS_MS);
      try { container.setPointerCapture(ev.pointerId); } catch (e) {}
    }

    function onPhotosPointerMove(ev) {
      if (!overlay.classList.contains("is-visible")) return;
      if (isDragMode) {
        ev.preventDefault();
        var dx = ev.clientX - startX;
        targetDragX = clamp(startOffsetX + dx);
        photoOffsets[0] = targetDragX;
        if (!settleId) settleId = requestAnimationFrame(tick);
      }
    }

    function onPhotosPointerUp(ev) {
      if (!overlay.classList.contains("is-visible")) return;
      try { container.releasePointerCapture(ev.pointerId); } catch (e) {}
      clearLongPressTimer();
      if (isDragMode) {
        isDragMode = false;
        track.classList.remove("is-dragging");
      }
    }

    function onPhotosPointerCancel(ev) {
      clearLongPressTimer();
      isDragMode = false;
      if (settleId) {
        cancelAnimationFrame(settleId);
        settleId = null;
      }
      settleStartTime = 0;
      track.classList.remove("is-dragging");
    }

    function onPhotosPointerLeave(ev) {
      if (!isDragMode) clearLongPressTimer();
    }

    function resetPhotos() {
      if (settleId) cancelAnimationFrame(settleId);
      settleId = null;
      settleStartTime = 0;
      targetDragX = 0;
      for (var i = 0; i < photoOffsets.length; i++) photoOffsets[i] = 0;
      applyOffsets();
      track.classList.remove("is-dragging");
    }
    overlay._bubble3ResetPhotos = resetPhotos;

    document.addEventListener("pointerdown", onPhotosPointerDown, { capture: true, passive: false });
    document.addEventListener("pointermove", onPhotosPointerMove, true);
    document.addEventListener("pointerup", onPhotosPointerUp, true);
    document.addEventListener("pointercancel", onPhotosPointerCancel, true);
    document.addEventListener("pointerleave", onPhotosPointerLeave, true);
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

  if (typeof window !== "undefined" && window.location && window.location.search.indexOf("embed=1") !== -1) {
    document.documentElement.classList.add("bubble3-embed");
  }
  window.addEventListener("message", function (e) {
    if (e.data === "collapse") {
      hideExpanded();
    }
  });
  runInit();

  var photo = document.querySelector(".bubble3__photo");
  if (photo) {
    photo.addEventListener("error", function () {
      this.src = "../../Pic/Frame 10.jpg";
    });
  }

  window.Bubble3 = {
    showExpanded: showExpanded,
    hideExpanded: hideExpanded
  };
})();
