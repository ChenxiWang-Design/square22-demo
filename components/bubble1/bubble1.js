/**
 * Bubble1 交互：StPageFlip 内页柔软卷曲（非封面生硬翻页）
 * 绿色 143×60 为一页，两页均为软页，拖拽书角即可卷曲翻页；翻到第 2 页后显示展开浮层
 */
(function () {
  var CONTAINER_ID = "bubble-flipbook";
  var GREEN_PAGE_INDEX = 0;   // 第 1 页：绿色气泡
  var EXPANDED_PAGE_INDEX = 1; // 第 2 页：翻过去后显示浮层

  function getContainer() {
    return document.getElementById(CONTAINER_ID);
  }

  function getOverlay() {
    return document.querySelector(".bubble1__overlay");
  }

  function getExpandedEl() {
    return document.querySelector(".bubble1__expanded");
  }

  function getDefaultEl() {
    var root = document.querySelector(".bubble1");
    return root ? root.querySelector(".bubble1__default") : null;
  }

  function showExpanded() {
    var defaultEl = getDefaultEl();
    var expanded = getExpandedEl();
    var overlay = getOverlay();
    if (!defaultEl || !expanded || !overlay) return;
    var rect = defaultEl.getBoundingClientRect();
    expanded.style.left = rect.left + "px";
    expanded.style.top = rect.top + "px";
    overlay.classList.add("is-visible");
    if (document.documentElement.classList.contains("bubble1-embed") && window.parent !== window) {
      try { window.parent.postMessage("bubble1-expanded", "*"); } catch (err) {}
    }
  }

  function hideExpanded() {
    var overlay = getOverlay();
    var expanded = getExpandedEl();
    var defaultEl = getDefaultEl();
    if (defaultEl && expanded) {
      var rect = defaultEl.getBoundingClientRect();
      expanded.style.left = rect.left + "px";
      expanded.style.top = rect.top + "px";
    }
    if (overlay) overlay.classList.remove("is-visible");
    var pageFlip = window.bubble1PageFlip;
    if (pageFlip && typeof pageFlip.turnToPage === "function") {
      pageFlip.turnToPage(GREEN_PAGE_INDEX);
    }
    if (document.documentElement.classList.contains("bubble1-embed") && window.parent !== window) {
      try { window.parent.postMessage("bubble1-collapsed", "*"); } catch (err) {}
    }
  }

  function init() {
    var container = getContainer();
    if (!container) {
      console.error("Bubble1: 未找到 #bubble-flipbook");
      return;
    }

    if (typeof St === "undefined" || typeof St.PageFlip !== "function") {
      var msg = "Bubble1: StPageFlip 未加载，请确认 page-flip.browser.js 已正确引入（若用 file:// 打开请用本地服务器）";
      console.error(msg);
      container.innerHTML = "<span style='color:#c00;font-size:12px;'>" + msg + "</span>";
      return;
    }

    // 内页柔软卷曲：固定尺寸、单页模式（usePortrait: true 否则库会按双页 width*2 算宽）、两页均为软页
    var pageFlip = new St.PageFlip(container, {
      size: "fixed",
      width: 131,
      height: 48,
      minWidth: 131,
      maxWidth: 131,
      minHeight: 48,
      maxHeight: 48,
      showCover: false,
      drawShadow: true,
      maxShadowOpacity: 0.4,
      flippingTime: 400,
      usePortrait: true,
      startPage: GREEN_PAGE_INDEX,
      startZIndex: 0,
      autoSize: false,
      mobileScrollSupport: true,
      useMouseEvents: true
    });

    var pages = container.querySelectorAll(".page");
    if (!pages || pages.length < 2) {
      console.error("Bubble1: 需要至少 2 个 .page 元素");
      return;
    }
    pageFlip.loadFromHTML(pages);

    pageFlip.on("flip", function (e) {
      if (e.data === EXPANDED_PAGE_INDEX) {
        showExpanded();
      }
    });

    window.bubble1PageFlip = pageFlip;

    // 备用：点击绿色区域触发翻页（库内部可能未正确绑定到小尺寸区域）
    var wrap = container.closest(".bubble1__flipbook-wrap");
    if (wrap) {
      wrap.addEventListener("click", function (ev) {
        var cur = pageFlip.getCurrentPageIndex ? pageFlip.getCurrentPageIndex() : -1;
        if (cur === GREEN_PAGE_INDEX) {
          pageFlip.flipNext();
        }
      });
    }

    var backdrop = document.querySelector(".bubble1__overlay-backdrop");
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
    document.documentElement.classList.add("bubble1-embed");
  }
  window.addEventListener("message", function (e) {
    if (e.data === "collapse") {
      hideExpanded();
    }
  });
  runInit();

  window.Bubble1 = {
    showExpanded: showExpanded,
    hideExpanded: hideExpanded
  };
})();
