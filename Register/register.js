/**
 * Register 流程管理
 * 管理多个页面的切换和状态
 */

// 当前页面索引（从1开始）
let currentPage = 1;
// 总页面数
const totalPages = document.querySelectorAll('.page').length;
// 分身名字变量（可在其他页面复用）
let 分身名字 = '';
// R3 用户头像加载延时定时器（进入 R3 或点击重载时使用）
let r3AvatarLoadTimeoutId = null;

/**
 * 初始化
 */
function init() {
  // 设置初始页面
  showPage(1);
  updateProgressIndicator();

  // 初始化分身名字输入框
  const avatarNameInput = document.getElementById('register-avatar-name-input');
  if (avatarNameInput) {
    avatarNameInput.addEventListener('input', function(e) {
      分身名字 = e.target.value.trim();
      console.log('分身名字已更新：', 分身名字);
    });
  }

  // 初始化称呼选择下拉菜单
  initTitleSelector();

  // 初始化下一步按钮点击事件
  initNextButton();

  // 初始化R2返回按钮点击事件
  initR2BackButton();

  // 初始化R3返回按钮点击事件
  initR3BackButton();

  // 初始化 R4 返回按钮点击事件
  initR4BackButton();

  // 初始化拍照按钮点击事件
  initCameraButton();

  // 初始化自动生成按钮点击事件
  initAutoGenerateButton();

  // 初始化R3下一步按钮点击事件
  initR3NextButton();

  // 初始化 R3 用户头像：进入时 2s 加载动画后渐显，点击可重新播放加载
  initR3AvatarLoadAndClick();

  // 可以在这里添加其他初始化逻辑
  console.log('Register流程初始化完成，总页面数：', totalPages);
}

/**
 * 显示指定页面
 * @param {number} pageNumber - 页面编号（从1开始）
 */
function showPage(pageNumber) {
  // 验证页面编号
  if (pageNumber < 1 || pageNumber > totalPages) {
    console.warn('无效的页面编号：', pageNumber);
    return;
  }

  // 移除所有页面的active类
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active', 'prev');
  });

  // 离开 R4 时移除文字动效类，以便再次进入时重播
  if (currentPage === 4 && pageNumber !== 4) {
    const page4 = document.querySelector('.page-4');
    if (page4) page4.classList.remove('register-r4-text-visible');
  }

  // 如果有上一个页面，添加prev类用于动画
  if (currentPage > 0 && currentPage !== pageNumber) {
    const prevPage = document.querySelector(`.page-${currentPage}`);
    if (prevPage) {
      prevPage.classList.add('prev');
    }
  }

  // 显示新页面
  const targetPage = document.querySelector(`.page-${pageNumber}`);
  if (targetPage) {
    targetPage.classList.add('active');
    currentPage = pageNumber;
    updateProgressIndicator();
    
    // 如果跳转到R2页面，更新分身名字显示
    if (pageNumber === 2) {
      updateR2AvatarName();
    }
    
    // 如果跳转到R3页面，更新分身名字显示并启动 2s 加载动画（下一步按钮在 startR3AvatarLoadSequence 内先禁用，加载完成后启用）
    if (pageNumber === 3) {
      updateR3AvatarName();
      startR3AvatarLoadSequence();
    }

    // 如果跳转到 R4 页面，更新分身名字显示并触发文字由下至上渐显
    if (pageNumber === 4) {
      updateR4AvatarName();
      const page4El = document.querySelector('.page-4');
      if (page4El) {
        page4El.classList.remove('register-r4-text-visible');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            page4El.classList.add('register-r4-text-visible');
          });
        });
      }
    }
  }
}

/**
 * 开始 R3 用户头像加载序列：先显示加载动画 2 秒，再渐显头像
 * 根据头像图片的实际加载状态来控制下一步按钮的禁用/启用
 */
function startR3AvatarLoadSequence() {
  const page3 = document.querySelector('.page-3');
  if (!page3) return;
  if (r3AvatarLoadTimeoutId) {
    clearTimeout(r3AvatarLoadTimeoutId);
    r3AvatarLoadTimeoutId = null;
  }
  page3.classList.remove('register-r3-avatar-loaded');
  const r3NextBtn = document.getElementById('register-r3-next-button');
  const avatarImg = document.getElementById('register-r3-user-avatar-img');
  
  // 先禁用下一步按钮
  if (r3NextBtn) {
    r3NextBtn.classList.add('register-r3-next-button-disabled');
  }
  
  // 检查头像图片是否已经加载完成
  function checkAvatarLoaded() {
    if (!avatarImg) {
      // 如果没有头像元素，使用定时器作为后备方案
      r3AvatarLoadTimeoutId = setTimeout(function () {
        r3AvatarLoadTimeoutId = null;
        page3.classList.add('register-r3-avatar-loaded');
        if (r3NextBtn) {
          r3NextBtn.classList.remove('register-r3-next-button-disabled');
        }
      }, 2000);
      return;
    }
    
    // 如果图片已经加载完成（complete为true且naturalWidth > 0）
    if (avatarImg.complete && avatarImg.naturalWidth > 0) {
      // 图片已加载，等待2秒后显示
      r3AvatarLoadTimeoutId = setTimeout(function () {
        r3AvatarLoadTimeoutId = null;
        page3.classList.add('register-r3-avatar-loaded');
        if (r3NextBtn) {
          r3NextBtn.classList.remove('register-r3-next-button-disabled');
        }
      }, 2000);
    } else {
      // 图片未加载完成，监听load事件
      avatarImg.addEventListener('load', function onAvatarLoad() {
        avatarImg.removeEventListener('load', onAvatarLoad);
        // 图片加载完成后，等待2秒后显示
        r3AvatarLoadTimeoutId = setTimeout(function () {
          r3AvatarLoadTimeoutId = null;
          page3.classList.add('register-r3-avatar-loaded');
          if (r3NextBtn) {
            r3NextBtn.classList.remove('register-r3-next-button-disabled');
          }
        }, 2000);
      }, { once: true });
      
      // 监听错误事件，如果加载失败也启用按钮（避免永久禁用）
      avatarImg.addEventListener('error', function onAvatarError() {
        avatarImg.removeEventListener('error', onAvatarError);
        // 加载失败时，等待2秒后也启用按钮
        r3AvatarLoadTimeoutId = setTimeout(function () {
          r3AvatarLoadTimeoutId = null;
          page3.classList.add('register-r3-avatar-loaded');
          if (r3NextBtn) {
            r3NextBtn.classList.remove('register-r3-next-button-disabled');
          }
        }, 2000);
      }, { once: true });
    }
  }
  
  checkAvatarLoaded();
}

/**
 * R3 用户头像：点击后消失 → 再播 2s 加载 → 渐显
 */
function initR3AvatarLoadAndClick() {
  const avatarImg = document.getElementById('register-r3-user-avatar-img');
  const page3 = document.querySelector('.page-3');
  if (!avatarImg || !page3) return;
  avatarImg.addEventListener('click', function () {
    if (!page3.classList.contains('register-r3-avatar-loaded')) return;
    startR3AvatarLoadSequence();
  });
}

/**
 * 更新R2页面的分身名字显示
 */
function updateR2AvatarName() {
  const r2NameText = document.getElementById('register-r2-avatar-name');
  if (r2NameText) {
    r2NameText.textContent = 分身名字 || '';
  }
}

/**
 * 更新R3页面的分身名字显示
 */
function updateR3AvatarName() {
  const r3NameText = document.getElementById('register-r3-avatar-name');
  if (r3NameText) {
    r3NameText.textContent = 分身名字 || '';
  }
}

/**
 * 更新 R4 页面的分身名字显示
 */
function updateR4AvatarName() {
  const r4NameText = document.getElementById('register-r4-avatar-name');
  if (r4NameText) {
    r4NameText.textContent = 分身名字 || '';
  }
}

/**
 * 跳转到下一页
 */
function goToNextPage() {
  if (currentPage < totalPages) {
    showPage(currentPage + 1);
  } else {
    console.log('已经是最后一页');
    // 可以在这里添加完成注册的逻辑
    onRegisterComplete();
  }
}

/**
 * 跳转到上一页
 */
function goToPrevPage() {
  if (currentPage > 1) {
    showPage(currentPage - 1);
  } else {
    console.log('已经是第一页');
  }
}

/**
 * 更新进度指示器
 */
function updateProgressIndicator() {
  document.querySelectorAll('.progress-dot').forEach((dot, index) => {
    const stepNumber = index + 1;
    if (stepNumber <= currentPage) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

/**
 * 注册完成回调
 */
function onRegisterComplete() {
  console.log('注册流程完成！');
  // 可以在这里添加完成后的逻辑，比如跳转到主界面
  // window.location.href = '../index.html';
}

/**
 * 跳转到指定页面（可以通过URL参数或外部调用）
 */
function goToPage(pageNumber) {
  showPage(pageNumber);
}

/**
 * 初始化称呼选择下拉菜单
 */
function initTitleSelector() {
  const trigger = document.getElementById('register-title-trigger');
  const menu = document.getElementById('register-title-menu');
  const display = document.getElementById('register-title-display');
  const menuText = document.getElementById('register-menu-text-svg');
  const exampleText = document.getElementById('register-example-text-svg');
  const options = document.querySelectorAll('.register-title-option');

  // 选项数据
  const titleOptions = {
    1: {
      menuText: '本人 - 正式通用的称呼',
      exampleText: '本人'
    },
    2: {
      menuText: '本尊 - 威风凛凛的称呼',
      exampleText: '本尊'
    },
    3: {
      menuText: '正主 - 娱乐轻松的称呼',
      exampleText: '正主'
    }
  };

  // 点击触发器显示/隐藏菜单
  if (trigger) {
    trigger.addEventListener('click', function(e) {
      e.stopPropagation();
      const isActive = trigger.classList.contains('active');
      
      if (isActive) {
        trigger.classList.remove('active');
        menu.classList.remove('show');
      } else {
        trigger.classList.add('active');
        menu.classList.add('show');
      }
    });
  }

  // 点击选项
  options.forEach(option => {
    option.addEventListener('click', function(e) {
      e.stopPropagation();
      const value = this.getAttribute('data-value');
      const optionData = titleOptions[value];

      if (optionData) {
        // 更新显示文本
        if (display) {
          display.textContent = optionData.menuText;
        }
        
        // 更新SVG中的菜单称呼文本（已隐藏，仅用于数据同步）
        if (menuText) {
          menuText.textContent = optionData.menuText;
        }
        
        // 更新SVG中的举例文本
        if (exampleText) {
          exampleText.textContent = optionData.exampleText;
        }

        // 关闭菜单
        if (trigger) {
          trigger.classList.remove('active');
        }
        if (menu) {
          menu.classList.remove('show');
        }
      }
    });
  });

  // 点击外部区域关闭菜单
  document.addEventListener('click', function(e) {
    if (trigger && menu && !trigger.contains(e.target) && !menu.contains(e.target)) {
      trigger.classList.remove('active');
      menu.classList.remove('show');
    }
  });
}

/**
 * 初始化下一步按钮点击事件
 */
function initNextButton() {
  const nextButton = document.getElementById('register-next-button');
  const nameInput = document.getElementById('register-avatar-name-input');
  const errorText = document.getElementById('register-name-error-text');
  
  // 检查输入框并更新按钮状态
  function updateNextButtonState() {
    if (nextButton && nameInput) {
      const nameValue = nameInput.value.trim();
      if (nameValue.length === 0) {
        nextButton.classList.add('register-next-button-disabled');
        nextButton.style.opacity = '0.5';
        nextButton.style.pointerEvents = 'none';
      } else {
        nextButton.classList.remove('register-next-button-disabled');
        nextButton.style.opacity = '1';
        nextButton.style.pointerEvents = 'all';
        // 隐藏错误提示
        if (errorText) {
          errorText.style.opacity = '0';
          errorText.style.display = 'none';
        }
      }
    }
  }
  
  // 监听输入框变化
  if (nameInput) {
    nameInput.addEventListener('input', function() {
      分身名字 = this.value.trim();
      updateNextButtonState();
    });
    nameInput.addEventListener('blur', function() {
      updateNextButtonState();
    });
  }
  
  // 初始状态检查
  updateNextButtonState();
  
  // 点击事件
  if (nextButton) {
    nextButton.addEventListener('click', function() {
      if (nameInput) {
        const nameValue = nameInput.value.trim();
        if (nameValue.length === 0) {
          // 显示错误提示
          if (errorText) {
            errorText.style.display = 'block';
            errorText.style.opacity = '1';
            // 3秒后淡出
            setTimeout(function() {
              errorText.style.opacity = '0';
              setTimeout(function() {
                errorText.style.display = 'none';
              }, 300);
            }, 3000);
          }
          return; // 阻止跳转
        }
      }
      goToNextPage();
    });
  }
}

/**
 * 初始化R2返回按钮点击事件
 */
function initR2BackButton() {
  const backButton = document.getElementById('register-r2-back-button');
  if (backButton) {
    backButton.addEventListener('click', function() {
      goToPrevPage();
    });
  }
}

/**
 * 初始化R3返回按钮点击事件
 */
function initR3BackButton() {
  const backButton = document.getElementById('register-r3-back-button');
  if (backButton) {
    backButton.addEventListener('click', function() {
      goToPrevPage();
    });
  }
}

/**
 * 初始化 R4 返回按钮点击事件
 */
function initR4BackButton() {
  const backButton = document.getElementById('register-r4-back-button');
  if (backButton) {
    backButton.addEventListener('click', function() {
      showPage(3);
    });
  }
}

/**
 * 拍照功能相关变量
 */
let cameraStream = null;
let capturedImageData = null;

/**
 * 初始化拍照按钮点击事件
 */
function initCameraButton() {
  const cameraButton = document.getElementById('register-camera-button');
  if (cameraButton) {
    cameraButton.addEventListener('click', function() {
      openCameraOverlay();
    });
  }

  // 拍摄按钮
  const captureButton = document.getElementById('register-camera-capture');
  if (captureButton) {
    captureButton.addEventListener('click', function() {
      capturePhoto();
    });
  }

  // 重拍按钮
  const retakeButton = document.getElementById('register-camera-retake');
  if (retakeButton) {
    retakeButton.addEventListener('click', function() {
      retakePhoto();
    });
  }

  // 确定按钮
  const confirmButton = document.getElementById('register-camera-confirm');
  if (confirmButton) {
    confirmButton.addEventListener('click', function() {
      confirmPhoto();
    });
  }
}

/**
 * 打开拍照界面
 */
async function openCameraOverlay() {
  const overlay = document.getElementById('register-camera-overlay');
  const video = document.getElementById('register-camera-video');
  const canvas = document.getElementById('register-camera-canvas');
  const capturedImg = document.getElementById('register-camera-captured');
  const captureBtn = document.getElementById('register-camera-capture');
  const retakeBtn = document.getElementById('register-camera-retake');
  const confirmBtn = document.getElementById('register-camera-confirm');

  if (!overlay || !video) return;

  overlay.style.display = 'flex';
  
  // 重置状态
  capturedImageData = null;
  video.style.display = 'block';
  capturedImg.style.display = 'none';
  captureBtn.style.display = 'block';
  retakeBtn.style.display = 'none';
  confirmBtn.style.display = 'none';

  try {
    // 请求摄像头权限
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user', // 前置摄像头
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    });
    
    video.srcObject = cameraStream;
    await video.play();
  } catch (error) {
    console.error('无法访问摄像头:', error);
    alert('无法访问摄像头，请检查权限设置');
    closeCameraOverlay();
  }
}

/**
 * 关闭拍照界面
 */
function closeCameraOverlay() {
  const overlay = document.getElementById('register-camera-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }

  // 停止摄像头流
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }

  const video = document.getElementById('register-camera-video');
  if (video) {
    video.srcObject = null;
  }
}

/**
 * 拍摄照片
 */
function capturePhoto() {
  const video = document.getElementById('register-camera-video');
  const canvas = document.getElementById('register-camera-canvas');
  const capturedImg = document.getElementById('register-camera-captured');
  const captureBtn = document.getElementById('register-camera-capture');
  const retakeBtn = document.getElementById('register-camera-retake');
  const confirmBtn = document.getElementById('register-camera-confirm');

  if (!video || !canvas || !capturedImg) return;

  // 设置canvas尺寸与video一致
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // 绘制当前视频帧到canvas
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // 转换为图片数据
  capturedImageData = canvas.toDataURL('image/png');

  // 显示拍摄的照片
  capturedImg.src = capturedImageData;
  video.style.display = 'none';
  capturedImg.style.display = 'block';

  // 停止摄像头流
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }

  // 切换按钮显示
  captureBtn.style.display = 'none';
  retakeBtn.style.display = 'block';
  confirmBtn.style.display = 'block';
}

/**
 * 重拍照片
 */
function retakePhoto() {
  const video = document.getElementById('register-camera-video');
  const capturedImg = document.getElementById('register-camera-captured');
  const captureBtn = document.getElementById('register-camera-capture');
  const retakeBtn = document.getElementById('register-camera-retake');
  const confirmBtn = document.getElementById('register-camera-confirm');

  if (!video || !capturedImg) return;

  // 重置状态
  capturedImageData = null;
  video.style.display = 'block';
  capturedImg.style.display = 'none';
  captureBtn.style.display = 'block';
  retakeBtn.style.display = 'none';
  confirmBtn.style.display = 'none';

  // 重新启动摄像头
  openCameraOverlay();
}

/**
 * 确认照片并跳转到R3
 */
function confirmPhoto() {
  if (!capturedImageData) {
    alert('请先拍摄照片');
    return;
  }

  // 关闭拍照界面
  closeCameraOverlay();

  // 跳转到R3页面
  showPage(3);
}

/**
 * 初始化自动生成按钮点击事件
 */
function initAutoGenerateButton() {
  const autoGenerateButton = document.getElementById('register-auto-generate-button');
  if (autoGenerateButton) {
    autoGenerateButton.addEventListener('click', function() {
      showPage(3);
    });
  }
}

/**
 * 初始化R3下一步按钮点击事件
 */
function initR3NextButton() {
  const r3NextButton = document.getElementById('register-r3-next-button');
  if (r3NextButton) {
    r3NextButton.addEventListener('click', function() {
      const page3 = document.querySelector('.page-3');
      if (page3 && !page3.classList.contains('register-r3-avatar-loaded')) {
        return; // 头像未完全显现时不响应点击
      }
      goToNextPage();
    });
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 导出函数供外部使用
window.RegisterFlow = {
  goToNextPage,
  goToPrevPage,
  goToPage,
  getCurrentPage: () => currentPage,
  getTotalPages: () => totalPages,
  get分身名字: () => 分身名字,
  set分身名字: (value) => {
    分身名字 = value;
    const avatarNameInput = document.getElementById('register-avatar-name-input');
    if (avatarNameInput) {
      avatarNameInput.value = value;
    }
  }
};
