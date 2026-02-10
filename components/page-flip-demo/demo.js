/**
 * StPageFlip 读书翻页 demo
 * 参考：https://www.cssscript.com/book-page-flip-animation/
 * 固定尺寸、内容随页翻动、无 jQuery 依赖
 */
(function () {
  var container = document.getElementById("flipbook");
  if (!container) return;

  function init() {
    if (typeof St === "undefined" || typeof St.PageFlip !== "function") {
      document.body.innerHTML =
        "<p style='color:#c00; padding:24px;'>StPageFlip 未加载。请检查网络或从 <a href='https://www.npmjs.com/package/page-flip'>npm page-flip</a> 安装后使用 dist/js/page-flip.browser.min.js。</p>";
      return;
    }

    var pageFlip = new St.PageFlip(container, {
      size: "fixed",
      width: 320,
      height: 440,
      minWidth: 320,
      maxWidth: 320,
      minHeight: 440,
      maxHeight: 440,
      maxShadowOpacity: 0.5,
      showCover: true,
      drawShadow: true,
      flippingTime: 500,
      usePortrait: false,
      startPage: 0,
      startZIndex: 0,
      autoSize: false,
      mobileScrollSupport: true
    });

    pageFlip.loadFromHTML(container.querySelectorAll(".page"));

    pageFlip.on("flip", function (e) {
      console.log("flip", e.data);
    });
    pageFlip.on("changeState", function (e) {
      console.log("changeState", e.data);
    });

    window.pageFlipDemo = pageFlip;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
