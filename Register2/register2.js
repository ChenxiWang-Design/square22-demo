/**
 * Register2 页面切换逻辑
 */

// 页面配置
const Register2Config = {
  totalPages: 6,
  currentPage: 1,
  animationDuration: 300
};

/**
 * 调整视口以适应浏览器UI（解决移动端浏览器遮挡问题）
 * 当 R1 姓名蒙层打开时不再调整，避免打字时键盘导致主界面上移（iPhone 等）
 */
function adjustViewportForBrowserUI() {
  var overlay = document.getElementById('r1-name-overlay');
  if (overlay && overlay.style.display === 'flex') return;
  const container = document.querySelector('.register2-container');
  if (!container) return;
  
  const availableHeight = window.innerHeight;
  const availableWidth = window.innerWidth;
  
  // 设计尺寸：360x793
  const designWidth = 360;
  const designHeight = 793;
  const designRatio = designHeight / designWidth;
  
  // 计算最佳显示尺寸
  let containerWidth = Math.min(designWidth, availableWidth);
  let containerHeight = containerWidth * designRatio;
  
  // 如果计算出的高度超过可用高度，按高度缩放
  if (containerHeight > availableHeight) {
    containerHeight = availableHeight;
    containerWidth = containerHeight / designRatio;
  }
  
  // 应用尺寸
  container.style.width = containerWidth + 'px';
  container.style.height = containerHeight + 'px';
  container.style.transform = `scale(${containerWidth / designWidth})`;
  container.style.transformOrigin = 'center center';
  
  console.log('视口调整:', {
    availableHeight,
    availableWidth,
    containerWidth,
    containerHeight,
    scale: containerWidth / designWidth
  });
}

// 页面加载完成后调整视口
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', adjustViewportForBrowserUI);
} else {
  adjustViewportForBrowserUI();
}

// 监听窗口大小变化和方向变化
window.addEventListener('resize', adjustViewportForBrowserUI);
window.addEventListener('orientationchange', () => {
  setTimeout(adjustViewportForBrowserUI, 100);
});

// 监听视口变化（移动端浏览器UI显示/隐藏）
let lastHeight = window.innerHeight;
window.addEventListener('resize', () => {
  const currentHeight = window.innerHeight;
  if (Math.abs(currentHeight - lastHeight) > 50) {
    setTimeout(adjustViewportForBrowserUI, 100);
    lastHeight = currentHeight;
  }
});

/** 进入 APP 时预先请求麦克风权限，避免在 R4 长按时才弹窗导致误触或打断 */
function requestMicPermissionOnLoad() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
      stream.getTracks().forEach(function (t) { t.stop(); });
    })
    .catch(function () {});
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', requestMicPermissionOnLoad);
} else {
  requestMicPermissionOnLoad();
}

// 分身名称变量（全局变量，供多个页面复用）
let 分身名称 = '';

// 用户称呼变量（全局变量，供多个页面复用）
let 用户称呼 = '';

/**
 * 重置页面滚动位置（解决手机端键盘收起或切换页面后界面整体上移、顶部被遮挡）
 */
function resetPageScroll() {
  if (typeof window.scrollTo === 'function') window.scrollTo(0, 0);
  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
}

/**
 * 打开R1输入框：使用蒙层输入，键盘只影响蒙层，主界面不移动、不缩小（手机端）
 */
function openR1Input() {
  var overlay = document.getElementById('r1-name-overlay');
  var overlayInput = document.getElementById('r1-name-overlay-input');
  var overlayCancel = document.getElementById('r1-name-overlay-cancel');
  var overlayConfirm = document.getElementById('r1-name-overlay-confirm');
  var display = document.getElementById('r1-avatar-name-display');
  if (!overlay || !overlayInput || !display) return;

  overlay.setAttribute('aria-hidden', 'false');
  overlay.style.display = 'flex';
  overlayInput.value = 分身名称;
  overlayInput.focus();

  function closeOverlay() {
    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');
    resetPageScroll();
  }

  function confirmOverlay() {
    分身名称 = overlayInput.value.trim();
    display.textContent = 分身名称;
    closeOverlay();
    updateR1NextButtonState();
  }

  overlayCancel.onclick = function () {
    overlayInput.value = 分身名称;
    closeOverlay();
  };
  overlayConfirm.onclick = function () { confirmOverlay(); };
  overlay.querySelector('.r1-name-overlay-backdrop').onclick = function () {
    overlayInput.value = 分身名称;
    closeOverlay();
  };
  overlayInput.onkeydown = function (e) {
    if (e.key === 'Enter') confirmOverlay();
    if (e.key === 'Escape') {
      overlayInput.value = 分身名称;
      closeOverlay();
    }
  };
}

/**
 * 更新R1下一步按钮状态
 */
function updateR1NextButtonState() {
  const button = document.getElementById('r1-next-button');
  if (button) {
    if (分身名称 && 分身名称.trim() !== '') {
      // 有输入名称，启用按钮
      button.classList.remove('r1-button-disabled');
    } else {
      // 没有输入名称，禁用按钮
      button.classList.add('r1-button-disabled');
    }
  }
}

/**
 * 处理R1下一步按钮点击
 */
function handleR1NextButtonClick() {
  // 检查是否禁用
  const button = document.getElementById('r1-next-button');
  if (button && button.classList.contains('r1-button-disabled')) {
    // 禁用状态，不执行跳转
    return;
  }
  
  // 检查是否有输入名称
  if (!分身名称 || 分身名称.trim() === '') {
    // 没有输入名称，不执行跳转
    return;
  }
  
  // 跳转到R2页面
  goToNextPage();
}

/**
 * 获取分身名称（供其他页面使用）
 * @returns {string} 分身名称
 */
function get分身名称() {
  return 分身名称;
}

/**
 * 设置分身名称（供其他页面使用）
 * @param {string} name - 分身名称
 */
function set分身名称(name) {
  分身名称 = name || '';
  const display = document.getElementById('r1-avatar-name-display');
  if (display) {
    display.textContent = 分身名称;
  }
}

/**
 * 切换R1用户称呼下拉菜单
 */
function toggleR1TitleMenu() {
  const trigger = document.getElementById('r1-title-trigger');
  const menu = document.getElementById('r1-title-menu');
  const arrow = document.getElementById('r1-title-arrow');
  const selector = document.querySelector('.r1-title-selector');
  
  if (trigger && menu) {
    const isActive = trigger.classList.contains('active');
    
    if (isActive) {
      trigger.classList.remove('active');
      menu.classList.remove('show');
      if (selector) selector.classList.remove('active');
      if (arrow) arrow.classList.remove('active');
    } else {
      trigger.classList.add('active');
      menu.classList.add('show');
      if (selector) selector.classList.add('active');
      if (arrow) arrow.classList.add('active');
    }
  }
}

/**
 * 选择R1用户称呼选项
 * @param {number} value - 选项值（1, 2, 或 3）
 */
function selectR1Title(value) {
  const titleOptions = {
    1: '本人-正式通用的称呼',
    2: '本尊-威风凛凛的称呼',
    3: '正主-娱乐有趣的称呼'
  };
  
  const shortTitleOptions = {
    1: '本人',
    2: '本尊',
    3: '正主'
  };
  
  const selectedText = titleOptions[value];
  const shortText = shortTitleOptions[value] || '本人';
  
  if (selectedText) {
    用户称呼 = selectedText;
    
    // 更新Y568位置的显示文本（下方的）
    const display = document.getElementById('r1-user-title-display');
    if (display) {
      display.textContent = 用户称呼;
    }
    
    // 更新X217 Y615位置的简短文本
    const shortDisplay = document.getElementById('r1-title-short-display');
    if (shortDisplay) {
      shortDisplay.textContent = shortText;
    }
    
    // 关闭菜单
    const trigger = document.getElementById('r1-title-trigger');
    const menu = document.getElementById('r1-title-menu');
    const arrow = document.getElementById('r1-title-arrow');
    const selector = document.querySelector('.r1-title-selector');
    
    if (trigger) {
      trigger.classList.remove('active');
    }
    if (menu) {
      menu.classList.remove('show');
    }
    if (selector) {
      selector.classList.remove('active');
    }
    if (arrow) {
      arrow.classList.remove('active');
    }
  }
}

/**
 * 获取用户称呼（供其他页面使用）
 * @returns {string} 用户称呼
 */
function get用户称呼() {
  return 用户称呼;
}

/**
 * 设置用户称呼（供其他页面使用）
 * @param {string} title - 用户称呼
 */
function set用户称呼(title) {
  用户称呼 = title || '';
  const display = document.getElementById('r1-user-title-display');
  
  if (display) {
    display.textContent = 用户称呼;
  }
}

/**
 * 初始化
 */
function initRegister2() {
  // 显示第一页
  showPage(1);
  updateProgressIndicator();
  
  // 初始化用户称呼下拉菜单
  initR1TitleSelector();
  
  // 初始化R1下一步按钮状态
  updateR1NextButtonState();
  
  // 绑定键盘事件（可选）
  document.addEventListener('keydown', handleKeyboard);
}

/**
 * 初始化R1用户称呼下拉菜单
 */
function initR1TitleSelector() {
  // 默认显示选项一的文本
  const defaultTitle = '本人-正式通用的称呼';
  const defaultShortTitle = '本人';
  用户称呼 = defaultTitle;
  
  const display = document.getElementById('r1-user-title-display');
  const shortDisplay = document.getElementById('r1-title-short-display');
  
  if (display) {
    display.textContent = defaultTitle;
  }
  
  if (shortDisplay) {
    shortDisplay.textContent = defaultShortTitle;
  }
}

/**
 * 显示指定页面
 * @param {number} pageNumber - 页面编号（从1开始）
 */
function showPage(pageNumber) {
  // 验证页面编号
  if (pageNumber < 1 || pageNumber > Register2Config.totalPages) {
    console.warn('无效的页面编号：', pageNumber);
    return;
  }

  // 移除所有页面的active类
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // 显示新页面
  const targetPage = document.querySelector(`.page-${pageNumber}`);
  if (targetPage) {
    targetPage.classList.add('active');
    Register2Config.currentPage = pageNumber;
    updateProgressIndicator();
    // 手机端：切换页面后恢复滚动位置，避免顶部被遮挡
    resetPageScroll();
    
    // R2页面：更新分身名称显示
    if (pageNumber === 2) {
      updateR2AvatarName();
    }
    
    if (pageNumber === 3) {
      updateR3AvatarName();
      initR3LoadAnimation();
      initR3HappyEyes();
    }
    
    if (pageNumber === 4) {
      updateR4AvatarName();
      initR4TextAnimation();
      initR4VoiceInput();
      checkR4ConversationRounds();
    }
    
    if (pageNumber === 5) {
      updateR5AvatarName();
      initR5ClosedEyes();
      initR5VoiceWave();
      initR5ScanText();
    }
    if (pageNumber === 6) {
      updateR6AvatarName();
      triggerR6IntroBubblePop();
      initR6Wave2Animation();
      initR6BlankBubbleOptions();
    }
    
    // 触发页面显示事件（可用于页面特定的初始化）
    triggerPageEvent(pageNumber, 'show');
  }
}

/**
 * 更新R2页面的分身名称显示
 */
function updateR2AvatarName() {
  const r2NameDisplay = document.getElementById('r2-header-avatar-name');
  if (r2NameDisplay) {
    r2NameDisplay.textContent = 分身名称 || '数字分身'; // 如果没有输入，显示默认值
  }
}

/**
 * 更新R3页面的分身名称显示
 */
function updateR3AvatarName() {
  const r3NameDisplay = document.getElementById('r3-header-avatar-name');
  if (r3NameDisplay) {
    r3NameDisplay.textContent = 分身名称 || '数字分身'; // 如果没有输入，显示默认值
  }
}

/**
 * R3下一步按钮点击处理
 */
function handleR3NextButtonClick() {
  goToNextPage();
}

/**
 * 初始化R3 Load动画（进入R3时）
 */
function initR3LoadAnimation() {
  const loadAnimation = document.querySelector('.r3-load-animation');
  const userAvatar = document.querySelector('.r3-user-avatar');
  const loadDots = document.querySelectorAll('.r3-load-dot');
  
  if (loadAnimation && userAvatar && loadDots.length > 0) {
    // 重置所有圆球的动画
    loadDots.forEach(dot => {
      dot.style.animation = 'none';
      void dot.offsetWidth; // 触发重排
      dot.style.animation = '';
    });
    
    // 显示load动画
    loadAnimation.classList.remove('hide');
    loadAnimation.style.opacity = '1';
    
    // 隐藏用户头像
    userAvatar.classList.remove('show');
    userAvatar.style.opacity = '0';
    
    // 4.8秒后（12个球依次跳完：12 * 0.4s = 4.8s），隐藏load动画，显示用户头像
    setTimeout(() => {
      loadAnimation.classList.add('hide');
      loadAnimation.style.opacity = '0';
      
      // 渐显用户头像
      setTimeout(() => {
        userAvatar.classList.add('show');
        userAvatar.style.opacity = '1';
      }, 100);
    }, 4800);
  }
}

/**
 * R3用户头像点击处理
 */
function handleR3UserAvatarClick() {
  const loadAnimation = document.querySelector('.r3-load-animation');
  const userAvatar = document.querySelector('.r3-user-avatar');
  const loadDots = document.querySelectorAll('.r3-load-dot');
  
  if (loadAnimation && userAvatar && loadDots.length > 0) {
    // 1. 渐隐用户头像
    userAvatar.classList.remove('show');
    userAvatar.style.opacity = '0';
    
    // 2. 显示并播放load动画
    setTimeout(() => {
      // 重置所有圆球的动画
      loadDots.forEach(dot => {
        dot.style.animation = 'none';
        void dot.offsetWidth; // 触发重排
        dot.style.animation = '';
      });
      
      loadAnimation.classList.remove('hide');
      loadAnimation.style.opacity = '1';
      
      // 3. 4.8秒后（12个球依次跳完：12 * 0.4s = 4.8s），隐藏load动画，渐显用户头像
      setTimeout(() => {
        loadAnimation.classList.add('hide');
        loadAnimation.style.opacity = '0';
        
        setTimeout(() => {
          userAvatar.classList.add('show');
          userAvatar.style.opacity = '1';
        }, 100);
      }, 4800);
    }, 500); // 等待渐隐动画完成
  }
}

/**
 * 更新R4页面的分身名称显示
 */
function updateR4AvatarName() {
  const r4NameDisplay = document.getElementById('r4-header-avatar-name');
  if (r4NameDisplay) {
    r4NameDisplay.textContent = 分身名称 || '数字分身'; // 如果没有输入，显示默认值
  }
}

/**
 * 更新R5页面的分身名称显示
 */
function updateR5AvatarName() {
  const r5NameDisplay = document.getElementById('r5-header-avatar-name');
  if (r5NameDisplay) {
    r5NameDisplay.textContent = 分身名称 || '数字分身'; // 如果没有输入，显示默认值
  }
}

/**
 * 更新R6页面的分身名称显示
 */
function updateR6AvatarName() {
  const r6NameDisplay = document.getElementById('r6-header-avatar-name');
  if (r6NameDisplay) {
    r6NameDisplay.textContent = 分身名称 || '数字分身';
  }
}

/**
 * R6 空白气泡内两个选项：点击切换勾选状态（单选）
 */
function initR6BlankBubbleOptions() {
  const container = document.getElementById('r6-blank-bubble');
  if (!container) return;
  const options = container.querySelectorAll('.r6-blank-bubble-option');
  const nextBtn = document.getElementById('r6-next-button');
  function setChecked(optionEl) {
    options.forEach((o) => o.classList.remove('checked'));
    optionEl.classList.add('checked');
    if (nextBtn) nextBtn.classList.remove('r6-next-button-disabled');
  }
  options.forEach((el) => {
    el.addEventListener('click', () => setChecked(el));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setChecked(el);
      }
    });
  });
}

/**
 * R6 进入时：介绍气泡从顶端放大 → 3 秒后以顶端为原点缩小到 0.1% → 显示空白气泡并以同方式放大
 */
function triggerR6IntroBubblePop() {
  const intro = document.getElementById('r6-intro-bubble');
  const blank = document.getElementById('r6-blank-bubble');
  if (!intro) return;
  intro.classList.remove('pop', 'shrink');
  intro.style.visibility = '';
  blank && blank.classList.remove('pop');
  if (blank) blank.style.visibility = 'hidden';
  requestAnimationFrame(() => {
    intro.classList.add('pop');
    setTimeout(() => {
      intro.classList.add('shrink');
      intro.addEventListener('animationend', function onShrinkEnd(e) {
        if (e.animationName !== 'r6BubbleShrink') return;
        intro.removeEventListener('animationend', onShrinkEnd);
        intro.style.visibility = 'hidden';
        if (blank) {
          blank.style.visibility = 'visible';
          blank.classList.remove('pop');
          requestAnimationFrame(() => blank.classList.add('pop'));
        }
      });
    }, 3000);
  });
}

/**
 * R6 声波2 动画相关
 */
let r6Wave2AnimationId = null;
let r6Wave2Bars = [];

/**
 * 初始化并启动 R6 声波2 动画（黑色粗条，两端透明度渐降，循环类似 R5 声波）
 */
function initR6Wave2Animation() {
  const container = document.getElementById('r6-wave-2-svg');
  if (!container) return;
  r6Wave2Bars = Array.from(container.querySelectorAll('.r6-wave2-bar'));
  const reflectionContainer = document.getElementById('r6-wave-2-svg-reflection');
  const reflectionBars = reflectionContainer
    ? Array.from(reflectionContainer.querySelectorAll('.r6-wave2-bar'))
    : [];
  if (r6Wave2Bars.length === 0) return;
  if (r6Wave2AnimationId !== null) {
    cancelAnimationFrame(r6Wave2AnimationId);
  }
  const barCount = r6Wave2Bars.length;
  let startTime = Date.now();
  function animate() {
    const elapsed = (Date.now() - startTime) * 0.001;
    r6Wave2Bars.forEach((bar, index) => {
      const centerIndex = (barCount - 1) / 2;
      const distanceFromCenter = Math.abs(index - centerIndex);
      const maxDistance = centerIndex || 1;
      const baseWaveHeight = 1 - (distanceFromCenter / maxDistance) * 0.5;
      const wave1 = Math.sin(elapsed * 2 + index * 0.25);
      const wave2 = Math.sin(elapsed * 1.2 + index * 0.18);
      const wave3 = Math.sin(elapsed * 0.8 + index * 0.12);
      const combinedWave = (wave1 * 0.4 + wave2 * 0.35 + wave3 * 0.25);
      const normalizedWave = (combinedWave + 1) / 2;
      const dynamicHeight = 0.2 + normalizedWave * 0.85;
      const finalHeight = 0.2 + (dynamicHeight - 0.2) * (0.5 + baseWaveHeight * 0.75);
      const transform = `scaleY(${finalHeight})`;
      bar.style.transform = transform;
      if (reflectionBars[index]) reflectionBars[index].style.transform = transform;
    });
    r6Wave2AnimationId = requestAnimationFrame(animate);
  }
  animate();
}

/**
 * 初始化R4文本渐显动画（由下至上，依次渐显）
 */
function initR4TextAnimation() {
  const textTitle = document.querySelector('.r4-text-title');
  const aiMessage = document.querySelector('.r4-ai-message');
  
  // 重置状态
  if (textTitle) {
    textTitle.classList.remove('show');
  }
  if (aiMessage) {
    aiMessage.classList.remove('show');
  }
  
  // 第一段文本渐显（延迟100ms开始）
  setTimeout(() => {
    if (textTitle) {
      textTitle.classList.add('show');
    }
  }, 100);
  
  // AI初始消息渐显（延迟600ms开始，在第一段动画进行中开始）
  setTimeout(() => {
    if (aiMessage) {
      aiMessage.classList.add('show');
    }
  }, 600);
}

/**
 * 打开R4输入框（R4 已改为语音输入组件，此函数保留兼容、无操作）
 */
function openR4Input() {
  const inputDisplay = document.getElementById('r4-input-text-display');
  const inputField = document.getElementById('r4-input-text-input');
  if (!inputDisplay || !inputField) return;
  const sendButton = document.getElementById('r4-send-button');
  
  // 如果显示文本有用户输入的内容，先同步到输入框
  if (inputDisplay.textContent && inputDisplay.textContent !== '和我的数字分身聊一聊') {
    inputField.value = inputDisplay.textContent;
  } else {
    inputField.value = '';
  }
  
  // 调整textarea高度
  adjustTextareaHeight(inputField);
  
  // 隐藏默认文本显示（使用 style.display 确保立即生效）
  inputDisplay.style.display = 'none';
  inputDisplay.classList.add('hidden');
  
  // 显示输入框
  inputField.style.display = 'block';
  inputField.focus();
  
  // 检查是否显示发送按钮
  updateSendButtonVisibility();
  
  // 监听输入事件
  const inputHandler = function() {
    adjustTextareaHeight(inputField);
    updateSendButtonVisibility();
    // 确保在输入过程中，显示文本始终保持隐藏
    if (inputDisplay) {
      inputDisplay.style.display = 'none';
    }
  };
  
  // 监听失焦事件
  const blurHandler = function() {
    // 如果输入为空，恢复默认文本
    if (!inputField.value || inputField.value.trim() === '') {
      inputDisplay.textContent = '和我的数字分身聊一聊';
      inputDisplay.style.display = 'block'; // 恢复显示
      inputDisplay.classList.remove('hidden');
      if (sendButton) sendButton.style.display = 'none';
    } else {
      // 有内容时，更新显示文本
      inputDisplay.textContent = inputField.value;
      inputDisplay.style.display = 'block'; // 恢复显示
      inputDisplay.classList.remove('hidden');
    }
    // 隐藏输入框
    inputField.style.display = 'none';
  };
  
  // 监听键盘事件（Ctrl+Enter发送，Enter换行）
  const keydownHandler = function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      sendR4Message(); // Ctrl+Enter发送
    }
  };
  
  // 移除旧的事件监听器（如果之前添加过），避免重复绑定
  inputField.removeEventListener('input', inputHandler);
  inputField.removeEventListener('blur', blurHandler);
  inputField.removeEventListener('keydown', keydownHandler);
  
  // 添加新的事件监听器
  inputField.addEventListener('input', inputHandler);
  inputField.addEventListener('blur', blurHandler);
  inputField.addEventListener('keydown', keydownHandler);
}

/**
 * 调整textarea高度
 */
function adjustTextareaHeight(textarea) {
  if (!textarea) return;
  
  // 重置高度以获取正确的scrollHeight
  textarea.style.height = 'auto';
  
  // 设置高度为内容高度，但不超过最大高度
  const scrollHeight = textarea.scrollHeight;
  const maxHeight = 30; // 最大高度30px（缩短至当前的一半）
  textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
}

/**
 * 更新发送按钮显示状态
 */
function updateSendButtonVisibility() {
  const inputField = document.getElementById('r4-input-text-input');
  const sendButton = document.getElementById('r4-send-button');
  
  if (!inputField || !sendButton) return;
  
  // 如果有输入内容，显示发送按钮
  if (inputField.value && inputField.value.trim() !== '') {
    sendButton.style.display = 'block';
  } else {
    sendButton.style.display = 'none';
  }
}

// R4对话历史记录（用于保持上下文）
// 注意：Claude API需要system消息来设置角色，但messages数组只包含user和assistant消息
let r4ConversationHistory = [];
// R4 用户发送条数（每次点击发送 +1，用于控制“发满2条显示下一步”）
let r4UserSendCount = 0;

/**
 * 调用Claude API获取AI回复
 * 注意：由于CORS限制，需要使用代理服务器或Chrome扩展
 */
async function callClaudeAPI(userMessage) {
  // API密钥已移除，现在通过代理服务器处理（server.js中使用环境变量）
  // 不再需要在这里硬编码API密钥
  
  // 方案1：使用本地代理服务器（推荐）
  // 方案2：如果使用Chrome扩展或可以绕过CORS，可以直接调用API
  const USE_LOCAL_PROXY = true; // 设置为false可以尝试直接调用API（如果浏览器插件可以绕过CORS）
  
  let API_URL;
  let fetchOptions;
  
  if (USE_LOCAL_PROXY) {
    // 通过代理服务器调用（支持本地和公网）
    // 优先使用环境变量或配置的API地址，否则使用localhost（本地开发）
    const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000';
    API_URL = `${API_BASE_URL}/api/claude`;
    fetchOptions = {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      }
    };
  } else {
    // 直接调用Claude API（需要Chrome扩展或CORS代理）
    API_URL = 'https://api.anthropic.com/v1/messages';
    fetchOptions = {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    };
  }
  
  // 添加用户消息到历史记录（若上一条已是 user，则合并为一条，避免 Claude 因非交替消息返回 403）
  if (r4ConversationHistory.length > 0 && r4ConversationHistory[r4ConversationHistory.length - 1].role === 'user') {
    r4ConversationHistory[r4ConversationHistory.length - 1].content += '\n\n' + userMessage;
  } else {
    r4ConversationHistory.push({ role: 'user', content: userMessage });
  }
  // 按发送条数计算轮数：发满2条即显示下一步按钮（不依赖AI是否已回复）
  checkR4ConversationRounds();

  // 构建消息数组（符合Claude API格式）
  const messages = r4ConversationHistory.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
  
  try {
    const requestBody = {
      // 尝试多个模型名称，按优先级排序
      // 如果 claude-3-5-sonnet 不可用，会尝试其他模型
      model: 'claude-3-opus-20240229', // 使用 Claude 3 Opus 模型（更强大，通常可用）
      max_tokens: 4096, // 取消50字限制，允许更长的回复
      messages: messages
    };
    
    // 添加system提示词，让AI扮演数字分身的引导者角色
    // 首次对话：更详细的引导性prompt
    if (r4ConversationHistory.length === 0) {
      requestBody.system = `你是一位专业的数字分身灵魂注入师，正在帮助用户将他们的个性、经历和思想注入到数字分身中。

你的核心任务：
1. **深度挖掘**：通过有策略的提问，引导用户分享他们的经历、价值观、性格特质、情感体验
2. **建立连接**：让用户感受到被理解和关注，鼓励他们敞开心扉
3. **捕捉细节**：关注用户的表达方式、用词习惯、情感倾向，这些都将成为数字分身的灵魂

对话策略：
- 从具体经历入手（童年、重要转折点、难忘时刻）
- 关注情感层面（什么让你感动、什么让你困扰、什么让你充满热情）
- 挖掘价值观（你认为什么最重要、你如何做决定、你的原则是什么）
- 了解表达习惯（你习惯如何描述事物、你的语言风格）

语气要求：
- 温暖而专业，像一位耐心的倾听者和引导者
- 真诚好奇，对用户的每个回答都表现出真正的兴趣
- 适度共情，能够理解并回应用户的情感
- 有目的性，每个问题都服务于"了解用户"这个目标

重要约束：
- 保持回复自然流畅，根据对话需要调整长度
- 不要一次性问太多问题，一次聚焦一个话题
- 根据用户的回答灵活调整提问方向，不要机械地按流程走`;
    } else {
      // 后续对话：保持引导性，但更简洁
      requestBody.system = `你是一位专业的数字分身灵魂注入师，正在帮助用户将他们的个性、经历和思想注入到数字分身中。

你的任务是：
- 通过有策略的提问，深度挖掘用户的经历、价值观、性格特质、情感体验
- 让用户感受到被理解和关注，鼓励他们敞开心扉
- 关注用户的表达方式、用词习惯、情感倾向

对话策略：
- 从用户的回答中寻找可以深入的点（情感、价值观、经历细节）
- 提出具体而深入的问题，引导用户分享更多
- 适时表达理解和共情，建立信任

语气：温暖、真诚、专业，像一位耐心的倾听者和引导者。

重要约束：
- 保持回复自然流畅，根据对话需要调整长度
- 根据对话进展灵活调整提问方向`;
    }
    
    console.log('发送API请求:', JSON.stringify(requestBody, null, 2));
    
    // 设置请求体
    if (USE_LOCAL_PROXY) {
      // 通过代理服务器，只需要传递messages和system
      fetchOptions.body = JSON.stringify({
        messages: requestBody.messages,
        system: requestBody.system
      });
    } else {
      // 直接调用，需要完整的请求体
      fetchOptions.body = JSON.stringify(requestBody);
    }
    
    // 添加超时控制（15秒，避免手机浏览器长时间等待）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error('请求超时（15秒）');
    }, 15000);
    
    let response;
    try {
      console.log('[API] 发送请求到:', API_URL);
      response = await fetch(API_URL, {
        ...fetchOptions,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      console.log('[API] 收到响应:', response.status, response.statusText);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('[API] 请求错误:', error);
      if (error.name === 'AbortError') {
        throw new Error('请求超时（15秒），请检查网络连接或稍后重试');
      }
      // 提供更详细的错误信息
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('网络连接失败。请检查：1) Railway服务是否在线 2) 网络连接是否正常 3) API地址是否正确');
      }
      // 如果是连接被拒绝，可能是Railway服务未启动或API地址错误
      if (error.message.includes('ECONNREFUSED') || error.message.includes('127.0.0.1')) {
        throw new Error('无法连接到API服务器。请确认Railway服务已部署并运行');
      }
      throw error;
    }
    
    // 先读取响应文本，以便调试
    const responseText = await response.text();
    console.log('API响应文本:', responseText);
    
    if (!response.ok) {
      console.error('API响应错误:', response.status, response.statusText);
      console.error('响应内容:', responseText);
      throw new Error(`API请求失败: ${response.status} ${response.statusText}. 响应: ${responseText}`);
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('API响应数据:', data);
    } catch (parseError) {
      console.error('JSON解析错误:', parseError);
      console.error('响应文本:', responseText);
      throw new Error('响应格式错误: ' + parseError.message);
    }
    
    // 提取AI回复内容
    let aiReply = '';
    console.log('开始解析响应内容，data结构:', JSON.stringify(data, null, 2));
    
    if (data.content && Array.isArray(data.content) && data.content.length > 0) {
      const firstContent = data.content[0];
      console.log('第一个content项:', firstContent);
      
      // Claude API返回的content是对象数组，每个对象有type和text字段
      if (firstContent.type === 'text' && firstContent.text) {
        aiReply = firstContent.text;
      } else if (typeof firstContent === 'string') {
        aiReply = firstContent;
      } else if (firstContent.text) {
        aiReply = firstContent.text;
      } else if (firstContent.content) {
        aiReply = firstContent.content;
      }
    } else if (data.text) {
      // 某些情况下可能直接返回text字段
      aiReply = data.text;
    }
    
    console.log('提取的AI回复:', aiReply);
    console.log('回复长度:', aiReply ? aiReply.length : 0, '字符');
    
    // 如果回复为空，记录警告
    if (!aiReply || aiReply.trim() === '') {
      console.warn('警告：AI回复为空！响应数据:', data);
      throw new Error('AI回复为空，请检查API响应格式');
    }
    
    // 添加AI回复到历史记录
    r4ConversationHistory.push({
      role: "assistant",
      content: aiReply
    });
    
    return aiReply;
  } catch (error) {
    console.error('Claude API调用错误:', error);
    console.error('错误详情:', error.message);
    
    // 检查是否是CORS错误
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      console.error('可能是CORS问题：浏览器直接调用Claude API被阻止。需要使用代理服务器。');
      throw new Error('CORS错误：无法直接调用API。请使用代理服务器或后端服务。');
    }
    
    // 返回错误信息以便调试
    throw error;
  }
}

/**
 * 显示AI回复
 */
function displayAIReply(replyText) {
  const messagesContainer = document.getElementById('r4-messages-container');
  const chatContainer = document.querySelector('.r4-chat-container');
  
  if (!messagesContainer || !replyText) return;
  
  // 移除"正在输入..."提示
  const typingIndicator = document.querySelector('.r4-typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
  
  // 创建AI回复元素
  const aiReplyElement = document.createElement('div');
  aiReplyElement.className = 'r4-ai-reply';
  aiReplyElement.textContent = replyText;
  
  // 添加到消息容器
  messagesContainer.appendChild(aiReplyElement);
  
  // 滚动到底部
  if (chatContainer) {
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 10);
  }
  
  // 检查对话轮数，达到2轮后切换按钮
  checkR4ConversationRounds();
}

/**
 * 检查R4对话轮数，按用户发送的消息条数计算：发满2条即显示下一步按钮
 */
function checkR4ConversationRounds() {
  const sentCount = r4UserSendCount;
  const voiceWrap = document.getElementById('r4-voice-wrap');
  const nextButton = document.getElementById('r4-next-button');
  const inputButton = document.querySelector('.r4-input-button');
  const inputDisplay = document.getElementById('r4-input-text-display');
  const inputField = document.getElementById('r4-input-text-input');

  if (sentCount >= 2) {
    if (voiceWrap) voiceWrap.style.display = 'none';
    if (inputButton) inputButton.style.display = 'none';
    if (inputDisplay) inputDisplay.style.display = 'none';
    if (nextButton) nextButton.style.display = 'block';
  } else {
    if (voiceWrap) voiceWrap.style.display = '';
    if (inputButton) inputButton.style.display = 'block';
    if (nextButton) nextButton.style.display = 'none';
    const isInputFieldVisible = inputField && (
      inputField === document.activeElement ||
      inputField.style.display === 'block' ||
      (window.getComputedStyle(inputField).display !== 'none' && inputField.offsetParent !== null)
    );
    if (inputDisplay && !isInputFieldVisible) {
      inputDisplay.style.display = 'block';
    } else if (inputDisplay && isInputFieldVisible) {
      inputDisplay.style.display = 'none';
    }
  }
}

/**
 * 处理R4下一步按钮点击
 */
function handleR4NextButtonClick() {
  console.log('R4下一步按钮被点击，已发送消息数:', r4UserSendCount);
  // 跳转到R5页面
  goToR5();
}

/**
 * 跳转到R5页面
 */
function goToR5() {
  goToPage(5);
}

/**
 * R5语音条动画相关变量
 */
let r5VoiceWaveAnimationId = null;
let r5VoiceWaveBars = [];
let r5VoiceWaveOriginalPaths = [];

/**
 * 初始化R5语音条
 */
function initR5VoiceWave() {
  const svg = document.getElementById('r5-voice-wave-svg');
  if (!svg) return;
  
  // 获取所有小条
  r5VoiceWaveBars = Array.from(svg.querySelectorAll('.r5-wave-bar'));
  
  // 保存每个小条的原始路径数据
  // 从SVG路径看，每个小条是从y=9到y=11，高度是2
  r5VoiceWaveOriginalPaths = r5VoiceWaveBars.map(bar => {
    const d = bar.getAttribute('d');
    // 解析路径，提取Y坐标范围
    // 路径格式包含V9和V11，表示从y=9到y=11
    const yMatches = d.match(/V\s*(\d+)/g) || d.match(/\d+\s+(\d+)/g);
    const yValues = [];
    if (yMatches) {
      yMatches.forEach(match => {
        const y = parseFloat(match.replace(/[^\d]/g, ''));
        if (!isNaN(y)) yValues.push(y);
      });
    }
    // 从路径中提取所有数字，找到Y坐标
    const allNumbers = d.match(/\d+/g);
    if (allNumbers) {
      allNumbers.forEach(num => {
        const n = parseFloat(num);
        if (n >= 0 && n <= 20) { // viewBox高度是20
          yValues.push(n);
        }
      });
    }
    const minY = yValues.length > 0 ? Math.min(...yValues.filter(y => y >= 8 && y <= 12)) : 9;
    const maxY = yValues.length > 0 ? Math.max(...yValues.filter(y => y >= 8 && y <= 12)) : 11;
    const height = maxY - minY || 2; // 默认高度2（从9到11）
    
    return {
      d: d,
      originalHeight: height
    };
  });
  
  // 确保所有小条初始状态都是正常高度（scaleY=1）
  r5VoiceWaveBars.forEach(bar => {
    bar.style.transform = 'scaleY(1)';
  });
}

/**
 * 启动R5语音条跳动动画
 */
function startR5VoiceWaveAnimation() {
  if (r5VoiceWaveAnimationId !== null) return; // 已经在运行
  
  const svg = document.getElementById('r5-voice-wave-svg');
  if (!svg || r5VoiceWaveBars.length === 0) return;
  
  // 基础高度（正常状态，从原始SVG看，每个小条高度是2，从y=9到y=11）
  const baseHeight = 2;
  const minHeight = 1; // 最小高度（跳动时的最小值）
  const maxHeight = 16; // 最大高度（跳动时的最大值，不超过viewBox高度20）
  
  let startTime = Date.now();
  
  function animate() {
    const currentTime = Date.now();
    const elapsed = (currentTime - startTime) * 0.001; // 转换为秒
    
    // 总共有96个小条（48个第一层 + 48个第二层），但实际显示的是48个
    // 我们只对前48个小条进行动画（第一层），第二层会跟随第一层
    const visibleBarCount = 48;
    
    r5VoiceWaveBars.forEach((bar, index) => {
      const original = r5VoiceWaveOriginalPaths[index];
      if (!original) return;
      
      // 只对前48个小条（第一层）进行动画，形成波形效果
      const barIndex = index % visibleBarCount;
      
      // 使用多个频率叠加，形成更自然的波形
      // 基础波形：从中心向两侧衰减的波形
      const centerIndex = visibleBarCount / 2;
      const distanceFromCenter = Math.abs(barIndex - centerIndex);
      const maxDistance = centerIndex;
      
      // 基础波形高度（中心高，两侧低）
      const baseWaveHeight = 1 - (distanceFromCenter / maxDistance) * 0.6; // 中心1.0，边缘0.4
      
      // 添加动态波动
      // 使用多个频率叠加，形成复杂的波形
      const wave1 = Math.sin(elapsed * 2 + barIndex * 0.2); // 快速波动
      const wave2 = Math.sin(elapsed * 1.2 + barIndex * 0.15); // 中速波动
      const wave3 = Math.sin(elapsed * 0.8 + barIndex * 0.1); // 慢速波动
      
      // 组合多个波形
      const combinedWave = (wave1 * 0.4 + wave2 * 0.35 + wave3 * 0.25);
      
      // 将波形值映射到高度范围
      // baseWaveHeight提供基础形状，combinedWave提供动态变化
      const normalizedWave = (combinedWave + 1) / 2; // 0到1
      const dynamicHeight = minHeight + normalizedWave * (maxHeight - minHeight);
      
      // 应用基础波形形状
      const finalHeight = minHeight + (dynamicHeight - minHeight) * (0.3 + baseWaveHeight * 0.7);
      
      // 使用transform scaleY来改变高度，以中心点为原点（transform-origin: center center）
      // 中点Y值不变，仅长度变化
      const scaleY = finalHeight / baseHeight;
      bar.style.transform = `scaleY(${scaleY})`;
    });
    
    r5VoiceWaveAnimationId = requestAnimationFrame(animate);
  }
  
  animate();
}

/**
 * 停止R5语音条跳动动画
 */
function stopR5VoiceWaveAnimation() {
  if (r5VoiceWaveAnimationId !== null) {
    cancelAnimationFrame(r5VoiceWaveAnimationId);
    r5VoiceWaveAnimationId = null;
  }
  
  // 恢复所有小条到原始状态
  r5VoiceWaveBars.forEach((bar, index) => {
    bar.style.transform = 'scaleY(1)'; // 恢复原始高度
  });
}

/**
 * R5扫描文字组件相关变量
 */
let r5ScanBarAnimationId = null;
let r5ScanCompleted = false;

/**
 * 初始化R5扫描文字组件（可拖动版本）
 */
function initR5ScanText() {
  const scanBar = document.getElementById('r5-scan-bar');
  const scanPill = document.getElementById('r5-scan-pill');
  const scanTextBase = document.getElementById('r5-scan-text-base');
  const scanGradientWrapper = document.getElementById('r5-scan-gradient-wrapper');
  const scanGradientText = document.getElementById('r5-scan-gradient-text');
  
  if (!scanBar || !scanPill || !scanTextBase || !scanGradientWrapper || !scanGradientText) return;
  
  // 初始化位置：右端在X60，宽度=1px
  updateR5GradientPosition(60);
  initR5DragInteraction();
  resetR5InteractionState();
}

// R5渐变矩形和扫描条的移动范围
const R5_MIN_RIGHT_X = 60;
const R5_MAX_RIGHT_X = 257;
let r5CurrentRightX = 60;

/**
 * 更新R5渐变位置（拉伸宽度）和粉色扫描条位置
 */
function updateR5GradientPosition(rightX) {
  const scanBar = document.getElementById('r5-scan-bar');
  const scanTextBase = document.getElementById('r5-scan-text-base');
  const scanGradientWrapper = document.getElementById('r5-scan-gradient-wrapper');
  const scanGradientText = document.getElementById('r5-scan-gradient-text');
  
  if (!scanBar || !scanTextBase || !scanGradientWrapper || !scanGradientText) return;
  
  // 限制在范围内
  rightX = Math.max(R5_MIN_RIGHT_X, Math.min(R5_MAX_RIGHT_X, rightX));
  r5CurrentRightX = rightX;
  
  // 计算渐变矩形的宽度：width = rightX - 59（左端固定在X59）
  const leftX = 59;
  const width = rightX - leftX;
  
  // 获取文字的实际宽度
  const textWidth = scanTextBase.offsetWidth;
  
  // 计算clip-path：从左侧0开始，右侧裁剪掉 (textWidth - width)
  const clipRight = Math.max(0, textWidth - width);
  scanGradientWrapper.style.clipPath = `inset(0 ${clipRight}px 0 0)`;
  
  // 渐变文字的background-size设置为当前宽度，background-position左对齐
  scanGradientText.style.backgroundSize = `${width}px 100%`;
  scanGradientText.style.backgroundPosition = '0 0';
  
  // 更新粉色扫描条位置：右端对齐rightX
  scanBar.style.left = `${rightX}px`;
}

/**
 * 初始化R5拖动交互
 */
function initR5DragInteraction() {
  const scanPill = document.getElementById('r5-scan-pill');
  if (!scanPill) return;
  
  let isDragging = false;
  let startX = 0;
  let startRightX = 0;
  
  // 获取药丸在页面中的位置
  function getPillRect() {
    return scanPill.getBoundingClientRect();
  }
  
  scanPill.addEventListener('mousedown', function(e) {
    // 停止自动动画，改为手动拖动
    stopR5ScanBarAnimation();
    isDragging = true;
    const rect = getPillRect();
    startX = e.clientX - rect.left;
    startRightX = r5CurrentRightX;
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    
    const rect = getPillRect();
    const currentX = e.clientX - rect.left;
    const deltaX = currentX - startX;
    const newRightX = startRightX + deltaX;
    updateR5GradientPosition(newRightX);
  });
  
  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      // 检查是否到达终点
      if (r5CurrentRightX >= R5_MAX_RIGHT_X) {
        onR5ScanBarComplete();
      }
    }
  });
  
  // 触摸支持
  scanPill.addEventListener('touchstart', function(e) {
    // 停止自动动画，改为手动拖动
    stopR5ScanBarAnimation();
    isDragging = true;
    const rect = getPillRect();
    startX = e.touches[0].clientX - rect.left;
    startRightX = r5CurrentRightX;
    e.preventDefault();
  });
  
  document.addEventListener('touchmove', function(e) {
    if (!isDragging) return;
    
    const rect = getPillRect();
    const currentX = e.touches[0].clientX - rect.left;
    const deltaX = currentX - startX;
    const newRightX = startRightX + deltaX;
    updateR5GradientPosition(newRightX);
    e.preventDefault();
  });
  
  document.addEventListener('touchend', function() {
    if (isDragging) {
      isDragging = false;
      if (r5CurrentRightX >= R5_MAX_RIGHT_X) {
        onR5ScanBarComplete();
      }
    }
  });
}

/**
 * 重置 R5 交互状态：显示常规态、隐藏按住说、隐藏语音条与扫描文字，未完成时释放会回到此状态
 */
function resetR5InteractionState() {
  r5ScanCompleted = false;
  r5CurrentRightX = 60; // 重置位置
  const normalBtn = document.getElementById('r5-normal-state-button');
  const holdBtn = document.getElementById('r5-hold-speak-button');
  const nextBtn = document.getElementById('r5-next-button');
  const progressDots = document.querySelector('.r5-progress-dots');
  const voiceWave = document.getElementById('r5-voice-wave-container');
  const scanContainer = document.getElementById('r5-scan-text-container');
  if (normalBtn) normalBtn.style.display = 'flex';
  if (holdBtn) holdBtn.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';
  if (progressDots) progressDots.classList.remove('r5-scan-complete');
  if (voiceWave) { voiceWave.classList.remove('r5-voice-wave-visible'); voiceWave.style.opacity = ''; }
  if (scanContainer) scanContainer.classList.remove('r5-scan-text-visible');
  // 重置渐变位置和扫描条位置
  updateR5GradientPosition(60);
  stopR5VoiceWaveAnimation();
  stopR5ScanBarAnimation();
}

/**
 * 启动R5扫描条动画（渐变矩形和扫描条从左往右自动移动）
 */
function startR5ScanBarAnimation() {
  if (r5ScanBarAnimationId !== null) return; // 已经在运行
  
  // 渐变矩形和扫描条右端从X60移动到X257
  const startRightX = R5_MIN_RIGHT_X; // 右端在X60
  const endRightX = R5_MAX_RIGHT_X; // 右端在X257
  
  let startTime = Date.now();
  const duration = 2000; // 动画持续时间2秒
  
  function animate() {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1); // 0到1
    
    // 使用ease-in-out缓动函数
    const easeProgress = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    // 计算当前右端位置
    const currentRightX = startRightX + (endRightX - startRightX) * easeProgress;
    updateR5GradientPosition(currentRightX);
    
    if (progress < 1) {
      r5ScanBarAnimationId = requestAnimationFrame(animate);
    } else {
      r5ScanBarAnimationId = null;
      onR5ScanBarComplete();
    }
  }
  
  animate();
}

/**
 * 粉色扫描条移动完毕时：隐藏按住说、显示下一步按钮、进度点前4个透明度100%
 */
function onR5ScanBarComplete() {
  r5ScanCompleted = true;
  const holdBtn = document.getElementById('r5-hold-speak-button');
  const nextBtn = document.getElementById('r5-next-button');
  const progressDots = document.querySelector('.r5-progress-dots');
  const voiceWaveContainer = document.getElementById('r5-voice-wave-container');
  if (holdBtn) holdBtn.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'flex';
  if (progressDots) progressDots.classList.add('r5-scan-complete');
  if (voiceWaveContainer) voiceWaveContainer.style.opacity = '0';
}

/**
 * 停止R5扫描条动画
 */
function stopR5ScanBarAnimation() {
  if (r5ScanBarAnimationId !== null) {
    cancelAnimationFrame(r5ScanBarAnimationId);
    r5ScanBarAnimationId = null;
  }
  // 如果未完成，恢复渐变矩形和扫描条到初始位置（右端在X60）
  if (!r5ScanCompleted) {
    updateR5GradientPosition(R5_MIN_RIGHT_X);
  }
}

/**
 * 常规态按下：隐藏常规态、显示按住说、显示语音条与扫描文字并启动动画
 */
function handleR5NormalStateDown(e) {
  if (e) { e.preventDefault(); e.stopPropagation(); }
  const normalBtn = document.getElementById('r5-normal-state-button');
  const holdBtn = document.getElementById('r5-hold-speak-button');
  const voiceWave = document.getElementById('r5-voice-wave-container');
  const scanContainer = document.getElementById('r5-scan-text-container');
  if (normalBtn) normalBtn.style.display = 'none';
  if (holdBtn) holdBtn.style.display = 'flex';
  if (voiceWave) voiceWave.classList.add('r5-voice-wave-visible');
  if (scanContainer) scanContainer.classList.add('r5-scan-text-visible');
  startR5VoiceWaveAnimation();
  startR5ScanBarAnimation();
}

/**
 * 处理R5按住说按钮按下：启动语音波动画和扫描条自动动画
 */
function handleR5HoldSpeakDown() {
  startR5VoiceWaveAnimation();
  startR5ScanBarAnimation(); // 启动渐变矩形和扫描条自动动画
}

/**
 * 处理R5按住说按钮释放：若扫描未完成则恢复常规态并停止动画
 */
function handleR5HoldSpeakUp() {
  stopR5VoiceWaveAnimation();
  stopR5ScanBarAnimation();
  if (!r5ScanCompleted) {
    const normalBtn = document.getElementById('r5-normal-state-button');
    const holdBtn = document.getElementById('r5-hold-speak-button');
    const voiceWave = document.getElementById('r5-voice-wave-container');
    const scanContainer = document.getElementById('r5-scan-text-container');
    const scanBar = document.getElementById('r5-scan-bar');
    if (normalBtn) normalBtn.style.display = 'flex';
    if (holdBtn) holdBtn.style.display = 'none';
    if (voiceWave) voiceWave.classList.remove('r5-voice-wave-visible');
    if (scanContainer) scanContainer.classList.remove('r5-scan-text-visible');
    if (scanBar) scanBar.style.left = '60px';
  }
}

/**
 * 处理R5下一步按钮点击
 */
function handleR5NextButtonClick() {
  goToPage(6);
}

/**
 * 处理R6进入广场按钮点击（未选择气泡选项时禁用，不响应点击）
 * 跳转回主界面，主界面将隐藏创建数字分身按钮并显示广场对话框
 */
function handleR6NextButtonClick() {
  const button = document.getElementById('r6-next-button');
  if (button && button.classList.contains('r6-next-button-disabled')) return;
  console.log('R6进入广场按钮被点击');
  sessionStorage.setItem('enteredSquare', '1');
  sessionStorage.setItem('avatarName', 分身名称 || '');
  window.location.href = '../index.html';
}

/**
 * 初始化R5闭眼动画（大部分时间闭眼，偶尔睁开）
 */
function initR5ClosedEyes() {
  const leftEye = document.querySelector('.r5-eye-left');
  const rightEye = document.querySelector('.r5-eye-right');
  const page5 = document.querySelector('.page-5');
  
  if (!leftEye || !rightEye || !page5) return;
  
  // 检查R5页面是否可见
  function isPage5Visible() {
    return page5.classList.contains('active');
  }
  
  // 眼睛中心坐标（限制X不超过160，集中在左侧）
  // 左眼中心X限制在160（不超过160）
  const leftEyeCenterX = 160;
  const leftEyeCenterY = 206.5;
  // 右眼位置：闭眼时间距23，但中心X不超过160
  // 如果左眼在160，右眼间距23，则右眼中心应该在160+23=183，但这超过了160
  // 所以我们需要调整：左眼向左移动，或者减小间距
  // 为了保持间距23，左眼需要向左移动：如果右眼中心最大160，左眼应该在160-23=137
  // 但用户要求集中在左侧，所以我们保持左眼在160，右眼也限制在160（重叠或非常接近）
  // 实际上，如果间距23且左眼在160，右眼应该在183，但183>160
  // 重新理解：用户可能是指眼睛的中心点X坐标不能超过160
  // 那么如果左眼中心在160，右眼中心也应该在160（重叠）或者更小
  // 但这样就没有间距了，不符合"间距增大8"的要求
  // 让我理解为：眼睛的中心点X坐标不能超过160，但可以重叠
  // 或者理解为：眼睛的最右端X坐标不能超过160
  
  // 重新理解：用户说"不要移动到X大于160的位置"，可能是指眼睛的中心点
  // 如果左眼中心在160，右眼中心也应该<=160
  // 但这样间距会很小或为0
  // 我觉得更合理的理解是：眼睛的中心点X坐标限制在160以内
  // 那么左眼中心可以稍微小于160，右眼中心也小于160，保持间距
  
  // 假设左眼中心在152，右眼中心在152+23=175，但175>160
  // 如果间距23，且右眼中心<=160，则左眼中心<=160-23=137
  // 但用户要求"集中在左侧"，所以左眼应该在更靠左的位置
  
  // 让我采用：左眼中心在137，右眼中心在160（间距23，且都不超过160）
  const leftEyeCenterXAdjusted = 137; // 左眼中心X（确保右眼不超过160）
  const rightEyeCenterXClosed = 160; // 闭眼时右眼中心X（最大160，间距23）
  const rightEyeCenterXOpen = 156; // 睁开时右眼中心X（稍微向左，减小移动幅度）
  const rightEyeCenterY = 206.5;
  
  // 正常状态：竖直线段，长度14
  const normalLength = 14;
  const normalHalfLength = normalLength / 2;
  
  // 闭眼状态：水平线段，宽度12（两条横线），间距23
  const closedWidth = 12;
  const closedHalfWidth = closedWidth / 2;
  
  let animationFrame = 0;
  const totalFrames = 600; // 10秒循环，60fps = 600帧
  let isClosedState = true;
  
  function animateClosedEyes() {
    // 只在R5页面可见时运行动画
    if (!isPage5Visible()) {
      // 页面不可见时，重置到闭眼状态
      if (!isClosedState) {
        isClosedState = true;
        leftEye.setAttribute('d', `M ${leftEyeCenterXAdjusted - closedHalfWidth} ${leftEyeCenterY} L ${leftEyeCenterXAdjusted + closedHalfWidth} ${leftEyeCenterY}`);
        rightEye.setAttribute('d', `M ${rightEyeCenterXClosed - closedHalfWidth} ${rightEyeCenterY} L ${rightEyeCenterXClosed + closedHalfWidth} ${rightEyeCenterY}`);
      }
      requestAnimationFrame(animateClosedEyes);
      return;
    }
    
    animationFrame++;
    
    // 10秒循环
    const cyclePosition = (animationFrame % totalFrames) / totalFrames;
    
    // 大部分时间闭眼（0-85%的时间，即8.5秒）
    if (cyclePosition < 0.85) {
      // 闭眼状态：保持两条横线，间距23，但X不超过160
      if (!isClosedState) {
        isClosedState = true;
      }
      leftEye.setAttribute('d', `M ${leftEyeCenterXAdjusted - closedHalfWidth} ${leftEyeCenterY} L ${leftEyeCenterXAdjusted + closedHalfWidth} ${leftEyeCenterY}`);
      rightEye.setAttribute('d', `M ${rightEyeCenterXClosed - closedHalfWidth} ${rightEyeCenterY} L ${rightEyeCenterXClosed + closedHalfWidth} ${rightEyeCenterY}`);
    } else {
      // 偶尔睁开（85%-100%的时间，即1.5秒）
      const openCycle = (cyclePosition - 0.85) / 0.15; // 0-1 within open period
      
      if (isClosedState) {
        isClosedState = false;
      }
      
      // 减小移动幅度并集中在左侧，X不超过160
      // 左眼保持在137，右眼在156-160之间移动
      
      if (openCycle < 0.1) {
        // 0-10%: 从闭眼到睁开（快速转换）
        const progress = openCycle / 0.1;
        // 从水平线旋转到竖直线
        const currentWidth = closedWidth * (1 - progress);
        const currentLength = normalLength * progress;
        const halfWidth = currentWidth / 2;
        const halfLength = currentLength / 2;
        // 右眼位置平滑过渡（从闭眼位置160到睁开位置156）
        const rightEyeX = rightEyeCenterXClosed + (rightEyeCenterXOpen - rightEyeCenterXClosed) * progress;
        if (progress < 0.5) {
          // 缩短宽度
          leftEye.setAttribute('d', `M ${leftEyeCenterXAdjusted - halfWidth} ${leftEyeCenterY} L ${leftEyeCenterXAdjusted + halfWidth} ${leftEyeCenterY}`);
          rightEye.setAttribute('d', `M ${rightEyeX - halfWidth} ${rightEyeCenterY} L ${rightEyeX + halfWidth} ${rightEyeCenterY}`);
        } else {
          // 拉长长度
          leftEye.setAttribute('d', `M ${leftEyeCenterXAdjusted} ${leftEyeCenterY - halfLength} L ${leftEyeCenterXAdjusted} ${leftEyeCenterY + halfLength}`);
          rightEye.setAttribute('d', `M ${rightEyeX} ${rightEyeCenterY - halfLength} L ${rightEyeX} ${rightEyeCenterY + halfLength}`);
        }
      } else if (openCycle < 0.3) {
        // 10-30%: 保持睁开状态，眼睛集中在左侧（右眼保持在156，不移动）
        leftEye.setAttribute('d', `M ${leftEyeCenterXAdjusted} ${leftEyeCenterY - normalHalfLength} L ${leftEyeCenterXAdjusted} ${leftEyeCenterY + normalHalfLength}`);
        rightEye.setAttribute('d', `M ${rightEyeCenterXOpen} ${rightEyeCenterY - normalHalfLength} L ${rightEyeCenterXOpen} ${rightEyeCenterY + normalHalfLength}`);
      } else if (openCycle < 0.4) {
        // 30-40%: 从睁开回到闭眼（快速转换）
        const progress = (openCycle - 0.3) / 0.1;
        const currentLength = normalLength * (1 - progress);
        const currentWidth = closedWidth * progress;
        const halfLength = currentLength / 2;
        const halfWidth = currentWidth / 2;
        // 右眼位置平滑过渡回闭眼位置（从睁开位置156回到闭眼位置160）
        const rightEyeX = rightEyeCenterXOpen + (rightEyeCenterXClosed - rightEyeCenterXOpen) * progress;
        if (progress < 0.5) {
          // 缩短长度
          leftEye.setAttribute('d', `M ${leftEyeCenterXAdjusted} ${leftEyeCenterY - halfLength} L ${leftEyeCenterXAdjusted} ${leftEyeCenterY + halfLength}`);
          rightEye.setAttribute('d', `M ${rightEyeX} ${rightEyeCenterY - halfLength} L ${rightEyeX} ${rightEyeCenterY + halfLength}`);
        } else {
          // 拉长宽度
          leftEye.setAttribute('d', `M ${leftEyeCenterXAdjusted - halfWidth} ${leftEyeCenterY} L ${leftEyeCenterXAdjusted + halfWidth} ${leftEyeCenterY}`);
          rightEye.setAttribute('d', `M ${rightEyeX - halfWidth} ${rightEyeCenterY} L ${rightEyeX + halfWidth} ${rightEyeCenterY}`);
        }
      } else {
        // 40-100%: 保持闭眼状态，间距23，X不超过160
        leftEye.setAttribute('d', `M ${leftEyeCenterXAdjusted - closedHalfWidth} ${leftEyeCenterY} L ${leftEyeCenterXAdjusted + closedHalfWidth} ${leftEyeCenterY}`);
        rightEye.setAttribute('d', `M ${rightEyeCenterXClosed - closedHalfWidth} ${rightEyeCenterY} L ${rightEyeCenterXClosed + closedHalfWidth} ${rightEyeCenterY}`);
      }
    }
    
    requestAnimationFrame(animateClosedEyes);
  }
  
  // 初始状态：闭眼，间距23，X不超过160
  leftEye.setAttribute('d', `M ${leftEyeCenterXAdjusted - closedHalfWidth} ${leftEyeCenterY} L ${leftEyeCenterXAdjusted + closedHalfWidth} ${leftEyeCenterY}`);
  rightEye.setAttribute('d', `M ${rightEyeCenterXClosed - closedHalfWidth} ${rightEyeCenterY} L ${rightEyeCenterXClosed + closedHalfWidth} ${rightEyeCenterY}`);
  
  animateClosedEyes();
}

/**
 * 显示"正在输入..."提示
 */
function showTypingIndicator() {
  const messagesContainer = document.getElementById('r4-messages-container');
  const chatContainer = document.querySelector('.r4-chat-container');
  
  if (!messagesContainer) return;
  
  // 移除已存在的提示
  const existingIndicator = document.querySelector('.r4-typing-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }
  
  // 创建"正在输入..."提示
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'r4-typing-indicator';
  typingIndicator.textContent = '正在输入...';
  
  messagesContainer.appendChild(typingIndicator);
  
  // 滚动到底部
  if (chatContainer) {
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 10);
  }
}

/**
 * 发送R4消息
 * @param {string} [optionalMessageText] - 可选，语音输入组件传入的文本；不传则从旧输入框取值（兼容）
 */
async function sendR4Message(optionalMessageText) {
  const messagesContainer = document.getElementById('r4-messages-container');
  const chatContainer = document.querySelector('.r4-chat-container');
  if (!messagesContainer) return;

  let messageText = '';
  if (typeof optionalMessageText === 'string') {
    messageText = optionalMessageText.trim();
  } else {
    const inputField = document.getElementById('r4-input-text-input');
    if (inputField) messageText = inputField.value.trim();
  }
  if (!messageText) return;
  
  // 创建对话气泡
  const messageBubble = document.createElement('div');
  messageBubble.className = 'r4-message-bubble';
  
  const messageTextElement = document.createElement('div');
  messageTextElement.className = 'r4-message-bubble-text';
  messageTextElement.textContent = messageText;
  
  messageBubble.appendChild(messageTextElement);
  messagesContainer.appendChild(messageBubble);

  if (chatContainer) {
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 10);
  }

  // 仅当来自旧输入框时清空输入区（R4 已改为语音组件，此处多为无操作）
  if (typeof optionalMessageText !== 'string') {
    const inputField = document.getElementById('r4-input-text-input');
    const inputDisplay = document.getElementById('r4-input-text-display');
    const sendButton = document.getElementById('r4-send-button');
    if (inputField) {
      inputField.value = '';
      adjustTextareaHeight(inputField);
      inputField.style.display = 'none';
    }
    if (sendButton) sendButton.style.display = 'none';
    if (inputDisplay) {
      inputDisplay.textContent = '和我的数字分身聊一聊';
      inputDisplay.style.display = 'block';
      inputDisplay.classList.remove('hidden');
    }
  }

  showTypingIndicator();
  r4UserSendCount += 1;
  checkR4ConversationRounds();

  try {
    const aiReply = await callClaudeAPI(messageText);
    if (aiReply) {
      displayAIReply(aiReply);
    } else {
      // 如果API调用失败，显示错误提示
      displayAIReply('抱歉，我现在无法回复，请稍后再试。');
    }
  } catch (error) {
    console.error('发送消息错误:', error);
    // 显示详细的错误信息（仅用于调试，生产环境应隐藏）
    const errorMessage = error.message || '未知错误';
    console.error('错误详情:', errorMessage);
    
    // 移除"正在输入..."提示
    const typingIndicator = document.querySelector('.r4-typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
    
    // 根据错误类型显示不同的提示
    if (errorMessage.includes('CORS')) {
      displayAIReply('抱歉，由于浏览器安全限制，无法直接调用API。请使用代理服务器或后端服务来调用Claude API。');
    } else {
      displayAIReply('抱歉，发生了错误：' + errorMessage + '。请检查浏览器控制台（F12）获取更多信息。');
    }
  }
}

/** R4 语音输入组件是否已初始化（只初始化一次） */
let r4VoiceInputInited = false;
/** 离开 R4 时释放麦克风，由 initR4VoiceInput 赋值 */
let r4VoiceReleaseMic = null;

/**
 * 初始化 R4 语音输入组件：三态（常规态 / 按住说 / 识别结果），发送后调用 sendR4Message
 */
function initR4VoiceInput() {
  const wrap = document.getElementById('r4-voice-wrap');
  const layerIdle = document.getElementById('r4-voice-idle');
  const layerRecording = document.getElementById('r4-voice-recording');
  const layerResult = document.getElementById('r4-voice-result');
  const resultText = document.getElementById('r4-voice-result-text');
  const hit = document.getElementById('r4-voice-hit');
  const backBtn = document.getElementById('r4-voice-back-btn');
  const sendBtn = document.getElementById('r4-voice-send-btn');
  const waveContainer = document.getElementById('r4-voice-wave-container');
  const waveSvg = document.getElementById('r4-voice-wave-svg');
  if (!wrap || !layerIdle || !layerRecording || !layerResult || !resultText || !hit) return;
  if (r4VoiceInputInited) {
    setR4VoiceState('idle');
    return;
  }
  r4VoiceInputInited = true;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isListening = false;
  let finalTranscript = '';
  let holdTimer = null;
  let waveBars = [];
  let waveAnimId = null;

  /* R4 不再请求麦克风流，仅用语音识别，避免手机端从扬声器回放自己声音 */
  r4VoiceReleaseMic = function () {
    stopR4Wave();
  };

  const BASE_H = 2;
  const MIN_H = 1;
  const MAX_H = 16;

  function setR4VoiceState(state) {
    layerIdle.classList.remove('active');
    layerRecording.classList.remove('active');
    layerResult.classList.remove('active');
    wrap.classList.remove('r4-voice-state-result');
    if (state === 'idle') {
      layerIdle.classList.add('active');
      hit.style.display = '';
      stopR4Wave();
    } else if (state === 'recording') {
      layerRecording.classList.add('active');
      hit.style.display = '';
      initR4WaveFake();
      runR4WaveLoopFake();
    } else {
      layerResult.classList.add('active');
      wrap.classList.add('r4-voice-state-result');
      stopR4Wave();
    }
  }

  /** 假波形：只取 DOM 条形，不请求麦克风 */
  function initR4WaveFake() {
    if (!waveSvg) return;
    waveBars = Array.from(waveSvg.querySelectorAll('.r4-voice-wave-bar'));
    waveBars.forEach(function (b) { b.style.transform = 'scaleY(1)'; });
  }

  /** 假波形动画：识别中显示动效，不依赖麦克风数据，绝不播放声音 */
  function runR4WaveLoopFake() {
    if (waveAnimId != null) return;
    var startTime = Date.now();
    function animate() {
      if (!layerRecording.classList.contains('active')) {
        waveAnimId = null;
        return;
      }
      var t = (Date.now() - startTime) / 200;
      waveBars.forEach(function (bar, index) {
        var noise = 0.7 + 0.3 * Math.sin(t + index * 0.5);
        var h = MIN_H + noise * (MAX_H - MIN_H);
        bar.style.transform = 'scaleY(' + (h / BASE_H) + ')';
      });
      waveAnimId = requestAnimationFrame(animate);
    }
    animate();
  }

  function stopR4Wave() {
    if (waveAnimId != null) {
      cancelAnimationFrame(waveAnimId);
      waveAnimId = null;
    }
    if (waveBars.length) waveBars.forEach(function (b) { b.style.transform = 'scaleY(1)'; });
  }

  /** 仅用语音识别，不请求 getUserMedia，保证不播放自己声音 */
  function startListening() {
    if (isListening) return;
    finalTranscript = '';
    recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = function () {
      isListening = true;
      setR4VoiceState('recording');
    };
    recognition.onresult = function (e) {
      var any = '';
      for (var i = e.resultIndex; i < e.results.length; i++) {
        var transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalTranscript += transcript;
        else any += transcript;
      }
      if (any || finalTranscript) resultText.textContent = finalTranscript + any;
    };
    recognition.onend = function () {
      isListening = false;
      if (finalTranscript) resultText.textContent = finalTranscript;
      setR4VoiceState('result');
    };
    recognition.onerror = function (e) {
      isListening = false;
      setR4VoiceState('result');
      if (!resultText.textContent) resultText.textContent = '识别出错';
    };
    try { recognition.start(); } catch (err) {
      setR4VoiceState('result');
      if (!resultText.textContent) resultText.textContent = '启动失败';
    }
  }

  function stopListening() {
    if (!recognition || !isListening) return;
    try { recognition.stop(); } catch (_) {}
    isListening = false;
  }

  function ensureMicAndStartRecording() {
    if (layerResult.classList.contains('active')) {
      resultText.textContent = '';
    }
    startListening();
    setR4VoiceState('recording');
  }

  function onPointerDown(e) {
    e.preventDefault();
    if (layerResult.classList.contains('active')) {
      holdTimer = setTimeout(function () {
        holdTimer = null;
        ensureMicAndStartRecording();
      }, 300);
      return;
    }
    ensureMicAndStartRecording();
  }

  function onPointerUp(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
      return;
    }
    stopListening();
    // 长按结束：若当前在识别中，立即切换到呈现文字状态，不依赖 recognition.onend 触发时机
    if (layerRecording.classList.contains('active')) {
      if (finalTranscript) resultText.textContent = finalTranscript;
      setR4VoiceState('result');
    }
  }

  if (!SpeechRecognition) {
    resultText.textContent = '当前浏览器不支持语音识别';
    setR4VoiceState('result');
    hit.style.pointerEvents = 'none';
    return;
  }

  hit.addEventListener('mousedown', onPointerDown);
  hit.addEventListener('mouseup', onPointerUp);
  hit.addEventListener('mouseleave', onPointerUp);
  hit.addEventListener('touchstart', function (e) { e.preventDefault(); onPointerDown(e); }, { passive: false });
  hit.addEventListener('touchend', function (e) { e.preventDefault(); onPointerUp(e); }, { passive: false });
  hit.addEventListener('touchcancel', function (e) { e.preventDefault(); onPointerUp(e); }, { passive: false });

  layerResult.addEventListener('mousedown', function (e) {
    if (e.target.closest('.r4-voice-send-btn') || e.target.closest('.r4-voice-back-btn')) return;
    if (e.target.closest('.r4-voice-result-text')) return;
    onPointerDown(e);
  });
  layerResult.addEventListener('mouseup', onPointerUp);
  layerResult.addEventListener('mouseleave', onPointerUp);
  layerResult.addEventListener('touchstart', function (e) {
    if (e.target.closest('.r4-voice-send-btn') || e.target.closest('.r4-voice-back-btn')) return;
    if (e.target.closest('.r4-voice-result-text')) return;
    e.preventDefault();
    onPointerDown(e);
  }, { passive: false });
  layerResult.addEventListener('touchend', function (e) { e.preventDefault(); onPointerUp(e); }, { passive: false });
  layerResult.addEventListener('touchcancel', function (e) { e.preventDefault(); onPointerUp(e); }, { passive: false });

  // 在 document 上监听松开，避免手指移出按钮后 touchend 未在 hit 上触发导致一直停在识别态
  function docPointerUp(e) {
    if (!layerRecording.classList.contains('active')) return;
    if (e.target && (e.target.closest('.r4-voice-send-btn') || e.target.closest('.r4-voice-back-btn'))) return;
    onPointerUp(e);
  }
  document.addEventListener('mouseup', docPointerUp);
  document.addEventListener('touchend', docPointerUp, { passive: false });
  document.addEventListener('touchcancel', docPointerUp, { passive: false });

  if (backBtn) {
    backBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      resultText.textContent = '';
      setR4VoiceState('idle');
    });
  }
  function doSendFromResult() {
    var text = (resultText.textContent || '').trim();
    if (text) {
      sendR4Message(text);
      resultText.textContent = '';
      setR4VoiceState('idle');
    }
  }
  if (sendBtn) {
    sendBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      doSendFromResult();
    });
    sendBtn.addEventListener('touchend', function (e) {
      e.preventDefault();
      e.stopPropagation();
      doSendFromResult();
    }, { passive: false });
  }

  setR4VoiceState('idle');
}

/**
 * 初始化R3高兴眼睛动画
 */
function initR3HappyEyes() {
  const leftEye = document.querySelector('.r3-eye-left');
  const rightEye = document.querySelector('.r3-eye-right');
  const page3 = document.querySelector('.page-3');
  
  if (!leftEye || !rightEye || !page3) return;
  
  // 检查R3页面是否可见
  function isPage3Visible() {
    return page3.classList.contains('active');
  }
  
  // 眼睛中心坐标（考虑scale 2.18和translateY -30px）
  const leftEyeCenterX = 172.5;
  const leftEyeCenterY = 206.5;
  const rightEyeCenterX = 205.2;
  const rightEyeCenterY = 206.5;
  
  // 正常状态：竖直线段，长度14
  const normalLength = 14;
  const normalHalfLength = normalLength / 2;
  
  // 水平状态：宽度12
  const happyWidth = 12;
  const happyHalfWidth = happyWidth / 2;
  
  // 间距：左眼最右端到右眼最左端保持36
  // 如果左眼中心172.5，右眼中心需要满足：(rightCenter - 6) - (172.5 + 6) = 36
  // rightCenter - 172.5 = 48
  // rightCenter = 220.5
  const rightEyeHappyCenterX = leftEyeCenterX + 48; // 220.5，保持36间距
  
  // 计算水平状态下的位置
  // 左眼水平：中心172.5，左端172.5-6=166.5，右端172.5+6=178.5
  // 右眼水平：中心220.5，左端220.5-6=214.5，右端220.5+6=226.5
  // 间距：214.5 - 178.5 = 36 ✓
  const leftEyeHappyLeft = leftEyeCenterX - happyHalfWidth;
  const leftEyeHappyRight = leftEyeCenterX + happyHalfWidth;
  const rightEyeHappyLeft = rightEyeHappyCenterX - happyHalfWidth;
  const rightEyeHappyRight = rightEyeHappyCenterX + happyHalfWidth;
  
  let animationFrame = 0;
  const totalFrames = 300; // 3秒，60fps = 180帧，设为300更平滑
  let isHappyState = false;
  let happyProgress = 0;
  
  function animateHappyEyes() {
    // 只在R3页面可见时运行动画
    if (!isPage3Visible()) {
      // 页面不可见时，重置到正常状态
      if (isHappyState) {
        isHappyState = false;
        leftEye.setAttribute('d', `M ${leftEyeCenterX} ${leftEyeCenterY - normalHalfLength} L ${leftEyeCenterX} ${leftEyeCenterY + normalHalfLength}`);
        rightEye.setAttribute('d', `M ${rightEyeCenterX} ${rightEyeCenterY - normalHalfLength} L ${rightEyeCenterX} ${rightEyeCenterY + normalHalfLength}`);
      }
      requestAnimationFrame(animateHappyEyes);
      return;
    }
    
    animationFrame++;
    
    // 每12秒触发一次高兴动画（在12秒循环中的特定时间段）
    const cyclePosition = (animationFrame % 720) / 720; // 12秒 * 60fps = 720帧
    
    // 30%-90%的时间保持微笑状态（增加微笑时间比例）
    if (cyclePosition >= 0.3 && cyclePosition < 0.9) {
      // 高兴状态：70%-95%的时间（1.5秒）
      if (!isHappyState) {
        isHappyState = true;
      }
      
      const happyCycle = (cyclePosition - 0.3) / 0.6; // 0-1 within happy period (30%-90%)
      
      if (happyCycle < 0.05) {
        // 0-5%: 缩短到1（加快转换速度）
        const progress = happyCycle / 0.05;
        const currentLength = normalLength * (1 - progress) + 1 * progress;
        const halfLength = currentLength / 2;
        leftEye.setAttribute('d', `M ${leftEyeCenterX} ${leftEyeCenterY - halfLength} L ${leftEyeCenterX} ${leftEyeCenterY + halfLength}`);
        rightEye.setAttribute('d', `M ${rightEyeCenterX} ${rightEyeCenterY - halfLength} L ${rightEyeCenterX} ${rightEyeCenterY + halfLength}`);
      } else if (happyCycle < 0.1) {
        // 5-10%: 旋转到水平并拉长到12
        const progress = (happyCycle - 0.05) / 0.05;
        const currentWidth = 1 * (1 - progress) + happyWidth * progress;
        const halfWidth = currentWidth / 2;
        leftEye.setAttribute('d', `M ${leftEyeCenterX - halfWidth} ${leftEyeCenterY} L ${leftEyeCenterX + halfWidth} ${leftEyeCenterY}`);
        rightEye.setAttribute('d', `M ${rightEyeHappyCenterX - halfWidth} ${rightEyeCenterY} L ${rightEyeHappyCenterX + halfWidth} ${rightEyeCenterY}`);
      } else if (happyCycle < 0.15) {
        // 10-15%: 中间锚点向上移动，形成倒V（快速到达）
        const progress = (happyCycle - 0.1) / 0.05;
        const upOffset = 10 * progress; // 向上移动10px
        leftEye.setAttribute('d', `M ${leftEyeHappyLeft} ${leftEyeCenterY} Q ${leftEyeCenterX} ${leftEyeCenterY - upOffset} ${leftEyeHappyRight} ${leftEyeCenterY}`);
        rightEye.setAttribute('d', `M ${rightEyeHappyLeft} ${rightEyeCenterY} Q ${rightEyeHappyCenterX} ${rightEyeCenterY - upOffset} ${rightEyeHappyRight} ${rightEyeCenterY}`);
      } else if (happyCycle < 0.85) {
        // 15-85%: 保持微笑状态（大幅增加保持时间）
        const upOffset = 10; // 保持最大弯曲
        leftEye.setAttribute('d', `M ${leftEyeHappyLeft} ${leftEyeCenterY} Q ${leftEyeCenterX} ${leftEyeCenterY - upOffset} ${leftEyeHappyRight} ${leftEyeCenterY}`);
        rightEye.setAttribute('d', `M ${rightEyeHappyLeft} ${rightEyeCenterY} Q ${rightEyeHappyCenterX} ${rightEyeCenterY - upOffset} ${rightEyeHappyRight} ${rightEyeCenterY}`);
      } else if (happyCycle < 0.9) {
        // 85-90%: 回到水平
        const progress = (happyCycle - 0.85) / 0.05;
        const upOffset = 10 * (1 - progress);
        leftEye.setAttribute('d', `M ${leftEyeHappyLeft} ${leftEyeCenterY} Q ${leftEyeCenterX} ${leftEyeCenterY - upOffset} ${leftEyeHappyRight} ${leftEyeCenterY}`);
        rightEye.setAttribute('d', `M ${rightEyeHappyLeft} ${rightEyeCenterY} Q ${rightEyeHappyCenterX} ${rightEyeCenterY - upOffset} ${rightEyeHappyRight} ${rightEyeCenterY}`);
      } else if (happyCycle < 0.95) {
        // 90-95%: 缩短
        const progress = (happyCycle - 0.9) / 0.05;
        const currentWidth = happyWidth * (1 - progress) + 1 * progress;
        const halfWidth = currentWidth / 2;
        leftEye.setAttribute('d', `M ${leftEyeCenterX - halfWidth} ${leftEyeCenterY} L ${leftEyeCenterX + halfWidth} ${leftEyeCenterY}`);
        rightEye.setAttribute('d', `M ${rightEyeHappyCenterX - halfWidth} ${rightEyeCenterY} L ${rightEyeHappyCenterX + halfWidth} ${rightEyeCenterY}`);
      } else {
        // 95-100%: 回到正常状态
        const progress = (happyCycle - 0.95) / 0.05;
        const currentLength = 1 * (1 - progress) + normalLength * progress;
        const halfLength = currentLength / 2;
        leftEye.setAttribute('d', `M ${leftEyeCenterX} ${leftEyeCenterY - halfLength} L ${leftEyeCenterX} ${leftEyeCenterY + halfLength}`);
        rightEye.setAttribute('d', `M ${rightEyeCenterX} ${rightEyeCenterY - halfLength} L ${rightEyeCenterX} ${rightEyeCenterY + halfLength}`);
      }
    } else {
      // 正常状态
      if (isHappyState) {
        isHappyState = false;
        // 确保回到正常状态
        leftEye.setAttribute('d', `M ${leftEyeCenterX} ${leftEyeCenterY - normalHalfLength} L ${leftEyeCenterX} ${leftEyeCenterY + normalHalfLength}`);
        rightEye.setAttribute('d', `M ${rightEyeCenterX} ${rightEyeCenterY - normalHalfLength} L ${rightEyeCenterX} ${rightEyeCenterY + normalHalfLength}`);
      }
    }
    
    requestAnimationFrame(animateHappyEyes);
  }
  
  animateHappyEyes();
}

/**
 * 跳转到下一页
 */
function goToNextPage() {
  if (Register2Config.currentPage < Register2Config.totalPages) {
    const nextPage = Register2Config.currentPage + 1;
    if (Register2Config.currentPage === 4 && typeof r4VoiceReleaseMic === 'function') {
      r4VoiceReleaseMic();
    }
    triggerPageEvent(Register2Config.currentPage, 'leave');
    setTimeout(() => {
      showPage(nextPage);
    }, 50);
  }
}

/**
 * 跳转到上一页
 */
/**
 * 跳转到主界面（R1 左上角返回按钮使用）
 */
function goToMainInterface() {
  window.location.href = '../index.html';
}

function goToPrevPage() {
  if (Register2Config.currentPage > 1) {
    const prevPage = Register2Config.currentPage - 1;
    if (Register2Config.currentPage === 4 && typeof r4VoiceReleaseMic === 'function') {
      r4VoiceReleaseMic();
    }
    triggerPageEvent(Register2Config.currentPage, 'leave');
    setTimeout(() => {
      showPage(prevPage);
    }, 50);
  }
}

/**
 * 跳转到指定页面
 * @param {number} pageNumber - 目标页面编号
 */
function goToPage(pageNumber) {
  if (pageNumber >= 1 && pageNumber <= Register2Config.totalPages) {
    if (Register2Config.currentPage === 4 && typeof r4VoiceReleaseMic === 'function') {
      r4VoiceReleaseMic();
    }
    triggerPageEvent(Register2Config.currentPage, 'leave');
    setTimeout(() => {
      showPage(pageNumber);
    }, 50);
  }
}

/**
 * 更新进度指示器
 */
function updateProgressIndicator() {
  // 更新R1页面的进度点（5个点）
  const r1ProgressDots = document.querySelectorAll('.r1-progress-dot');
  if (r1ProgressDots.length > 0) {
    r1ProgressDots.forEach((dot, index) => {
      if (index === 0 && Register2Config.currentPage === 1) {
        // 第一个点在R1页面时显示为100%透明度
        dot.classList.add('active');
      } else {
        // 其余点显示为10%透明度
        dot.classList.remove('active');
      }
    });
  }
  
  // 更新通用进度指示器（如果存在）
  document.querySelectorAll('.progress-dot:not(.r1-progress-dot)').forEach((dot, index) => {
    const pageNumber = index + 1;
    if (pageNumber === Register2Config.currentPage) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

/**
 * 触发页面事件
 * @param {number} pageNumber - 页面编号
 * @param {string} eventType - 事件类型（'show' 或 'leave'）
 */
function triggerPageEvent(pageNumber, eventType) {
  const pageElement = document.querySelector(`.page-${pageNumber}`);
  if (pageElement) {
    const event = new CustomEvent(`page-${eventType}`, {
      detail: { pageNumber, eventType }
    });
    pageElement.dispatchEvent(event);
  }
}

/**
 * 处理键盘事件
 * @param {KeyboardEvent} event - 键盘事件
 */
function handleKeyboard(event) {
  // 左箭头：上一页
  if (event.key === 'ArrowLeft') {
    goToPrevPage();
  }
  // 右箭头：下一页
  else if (event.key === 'ArrowRight') {
    goToNextPage();
  }
}

/**
 * 获取当前页面编号
 * @returns {number}
 */
function getCurrentPage() {
  return Register2Config.currentPage;
}

/**
 * 获取总页面数
 * @returns {number}
 */
function getTotalPages() {
  return Register2Config.totalPages;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initRegister2);

// 导出API（如果需要）
window.Register2Flow = {
  goToNextPage,
  goToPrevPage,
  goToPage,
  getCurrentPage,
  getTotalPages,
  showPage,
  get分身名称,
  set分身名称,
  get用户称呼,
  set用户称呼
};

// 点击外部区域关闭下拉菜单
document.addEventListener('click', function(e) {
  const trigger = document.getElementById('r1-title-trigger');
  const menu = document.getElementById('r1-title-menu');
  const arrow = document.getElementById('r1-title-arrow');
  const selector = document.querySelector('.r1-title-selector');
  
  if (trigger && menu && arrow && selector) {
    // 如果点击的不是触发器、菜单或箭头，则关闭菜单
    if (!trigger.contains(e.target) && !menu.contains(e.target) && !arrow.contains(e.target)) {
      trigger.classList.remove('active');
      menu.classList.remove('show');
      selector.classList.remove('active');
      arrow.classList.remove('active');
    }
  }
});

/* ==================== 拍照界面功能 ==================== */

let cameraStream = null;
let capturedImage = null;

/**
 * 打开拍照界面
 */
function openCameraInterface() {
  const cameraInterface = document.getElementById('camera-interface');
  const preview = document.getElementById('camera-preview');
  const canvas = document.getElementById('camera-canvas');
  const captureBtn = document.getElementById('camera-capture-btn');
  const reviewBtns = document.getElementById('camera-review-btns');
  
  // 显示拍照界面
  cameraInterface.classList.add('active');
  
  // 重置状态
  canvas.classList.remove('show');
  captureBtn.style.display = 'flex';
  reviewBtns.style.display = 'none';
  capturedImage = null;
  
  // 请求相机权限并启动预览
  navigator.mediaDevices.getUserMedia({ 
    video: { 
      facingMode: 'user', // 前置摄像头
      width: { ideal: 1280 },
      height: { ideal: 720 }
    } 
  })
  .then(stream => {
    cameraStream = stream;
    preview.srcObject = stream;
    preview.play();
  })
  .catch(err => {
    console.error('无法访问相机:', err);
    alert('无法访问相机，请检查权限设置');
    closeCameraInterface();
  });
}

/**
 * 关闭拍照界面
 */
function closeCameraInterface() {
  const cameraInterface = document.getElementById('camera-interface');
  const preview = document.getElementById('camera-preview');
  
  // 停止相机流
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
  
  // 隐藏预览
  if (preview.srcObject) {
    preview.srcObject = null;
  }
  
  // 关闭界面
  cameraInterface.classList.remove('active');
}

/**
 * 拍摄照片
 */
function capturePhoto() {
  const preview = document.getElementById('camera-preview');
  const canvas = document.getElementById('camera-canvas');
  const captureBtn = document.getElementById('camera-capture-btn');
  const reviewBtns = document.getElementById('camera-review-btns');
  
  // 设置canvas尺寸为360x793（容器尺寸）
  canvas.width = 360;
  canvas.height = 793;
  
  // 计算视频缩放比例以适应360x793容器
  const videoAspect = preview.videoWidth / preview.videoHeight;
  const containerAspect = 360 / 793;
  
  let drawWidth, drawHeight, drawX, drawY;
  
  if (videoAspect > containerAspect) {
    // 视频更宽，以高度为准
    drawHeight = 793;
    drawWidth = 793 * videoAspect;
    drawX = (360 - drawWidth) / 2;
    drawY = 0;
  } else {
    // 视频更高，以宽度为准
    drawWidth = 360;
    drawHeight = 360 / videoAspect;
    drawX = 0;
    drawY = (793 - drawHeight) / 2;
  }
  
  // 绘制当前视频帧到canvas（居中裁剪）
  const ctx = canvas.getContext('2d');
  ctx.drawImage(preview, drawX, drawY, drawWidth, drawHeight);
  
  // 保存图片数据
  capturedImage = canvas.toDataURL('image/jpeg', 0.9);
  
  // 停止相机流
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
  
  // 隐藏预览，显示拍摄的照片
  preview.style.display = 'none';
  canvas.classList.add('show');
  
  // 切换按钮显示
  captureBtn.style.display = 'none';
  reviewBtns.style.display = 'flex';
}

/**
 * 重拍照片
 */
function retakePhoto() {
  const preview = document.getElementById('camera-preview');
  const canvas = document.getElementById('camera-canvas');
  const captureBtn = document.getElementById('camera-capture-btn');
  const reviewBtns = document.getElementById('camera-review-btns');
  
  // 重置状态
  canvas.classList.remove('show');
  preview.style.display = 'block';
  captureBtn.style.display = 'flex';
  reviewBtns.style.display = 'none';
  capturedImage = null;
  
  // 重新启动相机预览
  navigator.mediaDevices.getUserMedia({ 
    video: { 
      facingMode: 'user',
      width: { ideal: 1280 },
      height: { ideal: 720 }
    } 
  })
  .then(stream => {
    cameraStream = stream;
    preview.srcObject = stream;
    preview.play();
  })
  .catch(err => {
    console.error('无法访问相机:', err);
    alert('无法访问相机，请检查权限设置');
  });
}

/**
 * 确认照片，进入R3
 */
function confirmPhoto() {
  // 保存拍摄的照片（如果需要）
  if (capturedImage) {
    // 可以将图片保存到变量或发送到服务器
    console.log('拍摄的照片已保存');
  }
  
  // 关闭拍照界面
  closeCameraInterface();
  
  // 跳转到R3
  goToR3();
}

/**
 * 跳转到R3页面（也用于自动生成按钮）
 */
function goToR3() {
  goToNextPage(); // 使用现有的页面切换函数
}
