/**
 * Bubble4 组件脚本
 * 处理脸部元素的动画效果（表情变化、眼睛移动）
 */

(function () {
  'use strict';

  // 检查是否为嵌入模式
  const isEmbedMode = window.location.search.includes('embed=1');
  if (isEmbedMode) {
    document.body.classList.add('embed-mode');
  }

  // 获取默认态元素
  const leftEye = document.getElementById('bubble4-left-eye');
  const rightEye = document.getElementById('bubble4-right-eye');
  const mouth = document.getElementById('bubble4-mouth');
  
  // 获取展开态元素
  const expandedLeftEye = document.getElementById('bubble4-expanded-left-eye');
  const expandedRightEye = document.getElementById('bubble4-expanded-right-eye');
  const expandedMouth = document.getElementById('bubble4-expanded-mouth');

  // 检查元素是否存在
  const hasDefaultFace = leftEye && rightEye && mouth;
  const hasExpandedFace = expandedLeftEye && expandedRightEye && expandedMouth;
  
  if (!hasDefaultFace && !hasExpandedFace) {
    console.warn('Bubble4: 脸部元素未找到');
    return;
  }

  // 眼睛移动范围（相对于初始位置，药丸形调整范围）
  const eyeMoveRange = {
    x: 6,  // 左右移动范围（进一步增大，可以多往右看看）
    y: 3,  // 上下移动范围
    xRight: 15  // 右边移动范围（更大，让眼睛更偏向右边）
  };
  
  // 展开态放大倍数（792 / 328）
  const expandedScale = 792 / 328;
  
  // 展开态眼睛移动范围（等比放大）
  const expandedEyeMoveRange = {
    x: eyeMoveRange.x * expandedScale,  // 14.49
    y: eyeMoveRange.y * expandedScale,  // 7.24
    xRight: eyeMoveRange.xRight * expandedScale  // 19.32
  };

  // 表情状态（移除mouthY，保持嘴巴位置固定，只改变大小）
  const expressions = {
    normal: { mouthScale: 1 },
    happy: { mouthScale: 1.15 },
    surprised: { mouthScale: 0.85 },
    thinking: { mouthScale: 0.95 }
  };

  let currentExpression = 'normal';
  let eyeAnimationInterval = null;
  let expressionChangeInterval = null;
  
  // 当前眼睛位置（用于平滑移动）
  let leftEyePos = { x: 0, y: 0 };
  let rightEyePos = { x: 0, y: 0 };
  let mouthPos = { x: 0, y: 0 };
  
  // 展开态眼睛位置
  let expandedLeftEyePos = { x: 0, y: 0 };
  let expandedRightEyePos = { x: 0, y: 0 };
  let expandedMouthPos = { x: 0, y: 0 };
  
  // 嘴巴和眼睛的距离（眼睛底部到嘴巴顶部的距离）
  // 眼睛初始top: 118px, height: 13px，底部在131px
  // 嘴巴初始top: 126px，顶部在126px
  // 距离：126 - 131 = -5px（嘴巴在眼睛上方5px）
  const eyeToMouthDistance = -5;

  // 平滑移动眼睛到目标位置（四处张望）
  function animateEyes() {
    // 生成新的目标位置（两个眼睛同步移动，保持同一水平线）
    // 调整随机数分布，让眼睛更偏向右边移动（正值）
    const randomValue = Math.random();
    let targetX;
    if (randomValue < 0.3) {
      // 30%的概率往左边移动（负值）
      targetX = -Math.random() * eyeMoveRange.x;
    } else {
      // 70%的概率往右边移动（正值），范围更大
      targetX = Math.random() * eyeMoveRange.xRight;
    }
    const targetY = (Math.random() - 0.5) * eyeMoveRange.y * 2;
    
    // 左眼可以稍微独立移动（模拟真实眼睛的微小差异）
    const leftTargetX = targetX + (Math.random() - 0.5) * 0.5; // 最多0.5px的差异
    const rightTargetX = targetX + (Math.random() - 0.5) * 0.5;
    
    // 但Y坐标必须完全一致，保持水平对齐
    const leftTargetY = targetY;
    const rightTargetY = targetY;

    // 更新眼睛位置（CSS transition会自动处理平滑过渡）
    leftEyePos = { x: leftTargetX, y: leftTargetY };
    rightEyePos = { x: rightTargetX, y: rightTargetY };

    // 更新默认态表情（如果存在）
    if (hasDefaultFace) {
      leftEye.style.transform = `translate(${leftTargetX}px, ${leftTargetY}px)`;
      rightEye.style.transform = `translate(${rightTargetX}px, ${rightTargetY}px)`;
      
      // 嘴巴跟随眼睛移动
      // 嘴巴的Y移动和眼睛的Y移动一致（保持嘴巴顶部和眼睛底部的距离）
      const mouthTargetY = targetY;
      
      // 嘴巴的X移动跟随眼睛中心
      const eyeCenterX = (leftTargetX + rightTargetX) / 2;
      const mouthTargetX = eyeCenterX;
      
      mouthPos = { x: mouthTargetX, y: mouthTargetY };
      
      // 获取当前表情的scale
      const expr = expressions[currentExpression];
      const mouthScale = expr ? expr.mouthScale : 1;
      
      // 更新嘴巴位置和大小
      mouth.style.transform = `translate(${mouthTargetX}px, ${mouthTargetY}px) scaleY(${mouthScale})`;
    }
    
    // 同步更新展开态表情（如果存在）
    if (hasExpandedFace) {
      // 展开态的位置和移动范围都等比放大
      const expandedLeftTargetX = leftTargetX * expandedScale;
      const expandedLeftTargetY = leftTargetY * expandedScale;
      const expandedRightTargetX = rightTargetX * expandedScale;
      const expandedRightTargetY = rightTargetY * expandedScale;
      
      // 嘴巴位置也等比放大
      const eyeCenterX = (leftTargetX + rightTargetX) / 2;
      const mouthTargetX = eyeCenterX;
      const expandedMouthTargetX = mouthTargetX * expandedScale;
      const expandedMouthTargetY = targetY * expandedScale;
      
      expandedLeftEyePos = { x: expandedLeftTargetX, y: expandedLeftTargetY };
      expandedRightEyePos = { x: expandedRightTargetX, y: expandedRightTargetY };
      expandedMouthPos = { x: expandedMouthTargetX, y: expandedMouthTargetY };
      
      const expr = expressions[currentExpression];
      const mouthScale = expr ? expr.mouthScale : 1;
      
      expandedLeftEye.style.transform = `translate(${expandedLeftTargetX}px, ${expandedLeftTargetY}px)`;
      expandedRightEye.style.transform = `translate(${expandedRightTargetX}px, ${expandedRightTargetY}px)`;
      expandedMouth.style.transform = `translate(${expandedMouthTargetX}px, ${expandedMouthTargetY}px) scaleY(${mouthScale})`;
    }
  }

  // 启动流畅的眼睛动画（更频繁的更新）
  function startEyeAnimation() {
    // 立即执行一次
    animateEyes();
    
    // 每1-2秒更新一次位置，让眼睛持续四处张望
    eyeAnimationInterval = setInterval(() => {
      animateEyes();
    }, 1000 + Math.random() * 1000);
  }

  // 改变表情
  function changeExpression() {
    const expressionKeys = Object.keys(expressions);
    const randomKey = expressionKeys[Math.floor(Math.random() * expressionKeys.length)];
    currentExpression = randomKey;
    const expr = expressions[randomKey];

    // 更新默认态嘴巴大小，同时保持当前位置（mouthPos已经在animateEyes中更新）
    if (hasDefaultFace) {
      mouth.style.transform = `translate(${mouthPos.x}px, ${mouthPos.y}px) scaleY(${expr.mouthScale})`;
    }
    
    // 同步更新展开态表情（如果存在）
    if (hasExpandedFace) {
      expandedMouth.style.transform = `translate(${expandedMouthPos.x}px, ${expandedMouthPos.y}px) scaleY(${expr.mouthScale})`;
    }
  }

  // 初始化动画
  function initAnimations() {
    // 初始化嘴巴位置
    mouthPos = { x: 0, y: 0 };
    expandedMouthPos = { x: 0, y: 0 };
    
    // 启动流畅的眼睛动画（会同时更新嘴巴位置）
    startEyeAnimation();

    // 表情变化（每3-5秒随机变化）
    changeExpression();
    expressionChangeInterval = setInterval(() => {
      changeExpression();
    }, 3000 + Math.random() * 2000);
  }

  // 启动动画
  initAnimations();

  // 清理函数（如果需要）
  window.addEventListener('beforeunload', () => {
    if (eyeAnimationInterval) {
      clearInterval(eyeAnimationInterval);
    }
    if (expressionChangeInterval) {
      clearInterval(expressionChangeInterval);
    }
    stopExpandedTextAnimation();
  });
})();

/**
 * Bubble4 展开态交互：长按默认态 → 展开态浮层
 */
(function () {
  'use strict';
  
  const LONG_PRESS_MS = 500;
  const DEFAULT_ID = 'bubble4-default';
  const OVERLAY_ID = 'bubble4-overlay';
  const BACKDROP_ID = 'bubble4-backdrop';
  const EXPANDED_ID = 'bubble4-expanded';

  let longPressTimer = null;
  let didLongPress = false;

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

  const isEmbedMode = window.location.search.includes('embed=1');
  
  // 展开态文本内容
  const expandedTexts = [
    { text: 'Hi！', fontSize: 32 },
    { text: '我是星星', fontSize: 14 },
    { text: '很高兴认识各位', fontSize: 14 },
    { text: '我平时喜欢看电影和徒步', fontSize: 14 },
    { text: '欢迎跟我交流这些领域的事情！', fontSize: 14 },
    { text: '说到电影，大家还记得最近看的电影是什么吗？', fontSize: 14 },
    { text: '你觉得好看吗？', fontSize: 14 }
  ];
  
  let expandedTextInterval = null;
  let currentTextIndex = 0;

  function startExpandedTextAnimation() {
    const textContent = document.querySelector('.bubble4__expanded-text-content');
    if (!textContent) return;
    
    // 重置索引
    currentTextIndex = 0;
    
    // 立即显示第一句
    showExpandedText(textContent, 0);
    
    // 每2秒切换到下一句
    expandedTextInterval = setInterval(() => {
      currentTextIndex = (currentTextIndex + 1) % expandedTexts.length;
      showExpandedText(textContent, currentTextIndex);
    }, 2000);
  }

  function showExpandedText(textElement, index) {
    const textData = expandedTexts[index];
    if (!textData) return;
    
    // 先隐藏
    textElement.classList.remove('is-visible');
    textElement.classList.remove('text-large');
    
    // 短暂延迟后更新内容和样式
    setTimeout(() => {
      textElement.textContent = textData.text;
      if (textData.fontSize === 32) {
        textElement.classList.add('text-large');
      }
      // 显示
      textElement.classList.add('is-visible');
    }, 150);
  }

  function stopExpandedTextAnimation() {
    if (expandedTextInterval) {
      clearInterval(expandedTextInterval);
      expandedTextInterval = null;
    }
    const textContent = document.querySelector('.bubble4__expanded-text-content');
    if (textContent) {
      textContent.classList.remove('is-visible');
    }
  }

  function showExpanded() {
    const defaultEl = getDefaultEl();
    const expanded = getExpandedEl();
    const overlay = getOverlay();
    if (!defaultEl || !expanded || !overlay) return;
    const rect = defaultEl.getBoundingClientRect();
    expanded.style.left = rect.left + 'px';
    expanded.style.top = rect.top + 'px';
    overlay.classList.add('is-visible');
    
    // 启动文本动画
    setTimeout(() => {
      startExpandedTextAnimation();
    }, 300); // 等待展开动画完成
    
    if (isEmbedMode && window.parent !== window) {
      try { window.parent.postMessage('bubble4-expanded', '*'); } catch (err) {}
    }
  }

  function hideExpanded() {
    const overlay = getOverlay();
    if (overlay) overlay.classList.remove('is-visible');
    
    // 停止文本动画
    stopExpandedTextAnimation();
    
    if (isEmbedMode && window.parent !== window) {
      try { window.parent.postMessage('bubble4-collapsed', '*'); } catch (err) {}
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
    const defaultEl = getDefaultEl();
    if (defaultEl) defaultEl.classList.remove('is-long-pressing');
    showExpanded();
  }

  function startLongPressTimer() {
    clearLongPressTimer();
    didLongPress = false;
    const defaultEl = getDefaultEl();
    if (defaultEl) defaultEl.classList.add('is-long-pressing');
    longPressTimer = setTimeout(onLongPressFired, LONG_PRESS_MS);
  }

  function cancelLongPress(ev) {
    clearLongPressTimer();
    const defaultEl = getDefaultEl();
    if (defaultEl) defaultEl.classList.remove('is-long-pressing');
  }

  function onPointerDown(ev) {
    if (ev.button !== 0) return; /* 只响应主键 */
    didLongPress = false; /* 新一次按下时重置 */
    startLongPressTimer();
    const defaultEl = getDefaultEl();
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
    const defaultEl = getDefaultEl();
    if (defaultEl && ev.target && defaultEl.contains(ev.target)) {
      ev.preventDefault();
    }
  }

  function init() {
    const defaultEl = getDefaultEl();
    const overlay = getOverlay();
    const backdrop = getBackdrop();
    if (!defaultEl) return;

    defaultEl.addEventListener('pointerdown', onPointerDown, { passive: true });
    defaultEl.addEventListener('pointerup', onPointerUp, { capture: false });
    defaultEl.addEventListener('pointercancel', onPointerCancel, { passive: true });
    defaultEl.addEventListener('pointerleave', onPointerLeave, { passive: true });
    defaultEl.addEventListener('click', onClick, { capture: true });
    defaultEl.addEventListener('contextmenu', onContextMenu, { passive: false });

    // 点击backdrop或overlay关闭展开态
    if (backdrop) {
      backdrop.addEventListener('click', function (ev) {
        ev.stopPropagation();
        hideExpanded();
      });
    }
    
    if (overlay) {
      overlay.addEventListener('click', function (ev) {
        // 如果点击的是overlay本身或backdrop，则关闭
        if (ev.target === overlay || ev.target === backdrop) {
          hideExpanded();
        }
      });
    }
    
    // 阻止expanded容器内的点击事件冒泡
    const expanded = getExpandedEl();
    if (expanded) {
      expanded.addEventListener('click', function (ev) {
        ev.stopPropagation();
      });
    }
  }

  function runInit() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        setTimeout(init, 0);
      });
    } else {
      setTimeout(init, 0);
    }
  }

  if (isEmbedMode) {
    document.documentElement.classList.add('bubble4-embed');
  }
  
  window.addEventListener('message', function (e) {
    if (e.data === 'collapse') {
      hideExpanded();
    }
  });
  
  runInit();

  window.Bubble4 = {
    showExpanded: showExpanded,
    hideExpanded: hideExpanded
  };
})();
