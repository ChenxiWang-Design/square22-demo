/**
 * B1chat 群聊界面逻辑
 * 后续可与主界面（index.html）通过 goToMain 等衔接
 */

// 返回主界面（预留：主界面连接后跳转）
function goToMain() {
  // 若在 iframe 内则由父页面处理；否则可跳转到主界面
  if (window.parent !== window && typeof window.parent.openMain !== 'undefined') {
    window.parent.openMain();
    return;
  }
  if (typeof window.openMain === 'function') {
    window.openMain();
    return;
  }
  // 独立预览时：尝试跳转到项目根 index
  try {
    window.location.href = '../index.html';
  } catch (e) {
    console.warn('B1chat: goToMain fallback', e);
  }
}

// 发送消息（从语音输入组件的识别结果发送）
function sendVoiceMessage(text) {
  if (!text || !text.trim()) return;
  var list = document.getElementById('b1chat-messages');
  if (!list) return;

  // 检查是否有选中的可见范围
  var hasAudience = selectedAudienceIds.length > 0;
  var bubbleClass = 'b1chat-msg-bubble';
  if (hasAudience) {
    bubbleClass += ' b1chat-msg-bubble-audience';
  }

  // 构建消息文本：如果有选中的人，在前面添加标签
  var messageText = text.trim();
  var tagsHtml = '';
  if (hasAudience) {
    var tags = selectedAudienceIds.map(function(id) {
      return audienceDisplayTags[id] || '';
    }).filter(function(tag) { return tag; });
    tagsHtml = tags.map(function(tag) {
      return '<span class="b1chat-msg-audience-tag">' + escapeHtml(tag) + '</span>';
    }).join('');
  }

  var msg = document.createElement('div');
  msg.className = 'b1chat-msg b1chat-msg-human b1chat-msg-self';
  msg.innerHTML = '<div class="b1chat-msg-avatar">我</div><div class="' + bubbleClass + '"><p class="b1chat-msg-text">' + tagsHtml + escapeHtml(messageText) + '</p></div>';
  list.appendChild(msg);
  list.scrollTop = list.scrollHeight;
}

function escapeHtml(s) {
  var div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

// 可见范围：当前选中的项（可多选），可为空表示谁都不选
var selectedAudienceIds = [];

var audienceLabels = {
  'other-person': '对方本人',
  'other-agent': '对方的数字分身',
  'my-agent': '我的数字分身'
};

// 可见范围标签映射（用于消息前缀显示）
var audienceDisplayTags = {
  'other-person': '[对方本人]',
  'other-agent': '[对方的AI]',
  'my-agent': '[我的AI]'
};

function getSelectedAudience() {
  return selectedAudienceIds.slice();
}

function updateAudienceChipText() {
  var el = document.getElementById('b1chat-audience-text');
  if (!el) return;
  if (selectedAudienceIds.length === 0) {
    el.textContent = '';
    return;
  }
  if (selectedAudienceIds.length === 1) {
    el.textContent = audienceLabels[selectedAudienceIds[0]] || selectedAudienceIds[0];
    return;
  }
  el.textContent = '已选 ' + selectedAudienceIds.length + ' 人';
}

/** B1chat 语音输入组件是否已初始化（只初始化一次） */
let b1chatVoiceInputInited = false;
/** 离开页面时释放麦克风，由 initB1chatVoiceInput 赋值 */
let b1chatVoiceReleaseMic = null;

/**
 * 初始化 B1chat 语音输入组件（与 R4 一致）：三态（常规态 / 按住说 / 识别结果），发送后调用 sendVoiceMessage
 * 逻辑原样来自 R4：假波形、麦克风不接扬声器、长按 300ms 再录、document 全局 pointerup 等
 */
function initB1chatVoiceInput() {
  const wrap = document.getElementById('b1chat-voice-wrap');
  const layerIdle = document.getElementById('b1chat-voice-idle');
  const layerRecording = document.getElementById('b1chat-voice-recording');
  const layerResult = document.getElementById('b1chat-voice-result');
  const resultText = document.getElementById('b1chat-voice-result-text');
  const hit = document.getElementById('b1chat-voice-hit');
  const backBtn = document.getElementById('b1chat-voice-back-btn');
  const sendBtn = document.getElementById('b1chat-voice-send-btn');
  const waveContainer = document.getElementById('b1chat-voice-wave-container');
  const waveSvg = document.getElementById('b1chat-voice-wave-svg');
  if (!wrap || !layerIdle || !layerRecording || !layerResult || !resultText || !hit) return;
  if (b1chatVoiceInputInited) {
    setB1chatVoiceState('idle');
    return;
  }
  b1chatVoiceInputInited = true;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isListening = false;
  let finalTranscript = '';
  let holdTimer = null;
  let waveBars = [];
  let waveAnimId = null;
  let b1chatMicStream = null;
  let b1chatAudioContext = null;
  let b1chatAnalyser = null;
  let b1chatFreqData = null;

  b1chatVoiceReleaseMic = function () {
    stopB1chatWave();
    if (b1chatMicStream) {
      b1chatMicStream.getTracks().forEach(function (t) { t.stop(); });
      b1chatMicStream = null;
    }
  };

  const BASE_H = 2;
  const MIN_H = 1;
  const MAX_H = 16;
  const B1CHAT_VISIBLE_BARS = 48;
  const B1CHAT_VOLUME_THRESHOLD = 18;

  function setB1chatVoiceState(state) {
    layerIdle.classList.remove('active');
    layerRecording.classList.remove('active');
    layerResult.classList.remove('active');
    wrap.classList.remove('b1chat-voice-state-result');
    if (state === 'idle') {
      layerIdle.classList.add('active');
      hit.style.display = '';
      stopB1chatWave();
    } else if (state === 'recording') {
      layerRecording.classList.add('active');
      hit.style.display = '';
      if (b1chatMicStream) {
        initB1chatWave();
        runB1chatWaveLoop();
      } else {
        initB1chatWaveFake();
        runB1chatWaveLoopFake();
      }
    } else {
      layerResult.classList.add('active');
      wrap.classList.add('b1chat-voice-state-result');
      stopB1chatWave();
    }
  }

  function initB1chatWaveFake() {
    if (!waveSvg) return;
    waveBars = Array.from(waveSvg.querySelectorAll('.b1chat-voice-wave-bar'));
    waveBars.forEach(function (b) { b.style.transform = 'scaleY(1)'; });
  }

  function runB1chatWaveLoopFake() {
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

  function initB1chatWave() {
    if (!waveSvg || !b1chatMicStream) return;
    waveBars = Array.from(waveSvg.querySelectorAll('.b1chat-voice-wave-bar'));
    waveBars.forEach(function (b) { b.style.transform = 'scaleY(1)'; });
    b1chatAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    b1chatAnalyser = b1chatAudioContext.createAnalyser();
    b1chatAnalyser.fftSize = 256;
    b1chatAnalyser.smoothingTimeConstant = 0.6;
    var src = b1chatAudioContext.createMediaStreamSource(b1chatMicStream);
    src.connect(b1chatAnalyser);
    b1chatFreqData = new Uint8Array(b1chatAnalyser.frequencyBinCount);
  }

  function runB1chatWaveLoop() {
    if (waveAnimId != null) return;
    function animate() {
      if (!layerRecording.classList.contains('active')) {
        waveAnimId = null;
        return;
      }
      var avg = 0, binPerBar = 0;
      if (b1chatAnalyser && b1chatFreqData && b1chatFreqData.length) {
        b1chatAnalyser.getByteFrequencyData(b1chatFreqData);
        for (var i = 0; i < b1chatFreqData.length; i++) avg += b1chatFreqData[i];
        avg = avg / b1chatFreqData.length;
        binPerBar = Math.max(1, Math.floor(b1chatFreqData.length / B1CHAT_VISIBLE_BARS));
      }
      waveBars.forEach(function (bar, index) {
        var barIndex = index % B1CHAT_VISIBLE_BARS;
        if (avg < B1CHAT_VOLUME_THRESHOLD || !b1chatFreqData || !binPerBar) {
          bar.style.transform = 'scaleY(1)';
          return;
        }
        var sum = 0, start = barIndex * binPerBar, end = Math.min(start + binPerBar, b1chatFreqData.length);
        for (var j = start; j < end; j++) sum += b1chatFreqData[j];
        var val = end > start ? sum / (end - start) : 0;
        var normalized = Math.min(255, val) / 255;
        var h = MIN_H + normalized * (MAX_H - MIN_H);
        bar.style.transform = 'scaleY(' + (h / BASE_H) + ')';
      });
      waveAnimId = requestAnimationFrame(animate);
    }
    animate();
  }

  function stopB1chatWave() {
    if (waveAnimId != null) {
      cancelAnimationFrame(waveAnimId);
      waveAnimId = null;
    }
    if (waveBars.length) waveBars.forEach(function (b) { b.style.transform = 'scaleY(1)'; });
    if (b1chatAudioContext) {
      b1chatAudioContext.close().catch(function () {});
      b1chatAudioContext = null;
    }
    b1chatAnalyser = null;
    b1chatFreqData = null;
  }

  function startListening() {
    if (isListening) return;
    finalTranscript = '';
    recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = function () {
      isListening = true;
      setB1chatVoiceState('recording');
      if (!b1chatMicStream && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
          if (!b1chatMicStream) {
            b1chatMicStream = stream;
            if (layerRecording.classList.contains('active')) {
              stopB1chatWave();
              initB1chatWave();
              runB1chatWaveLoop();
            }
          } else {
            stream.getTracks().forEach(function (t) { t.stop(); });
          }
        }).catch(function () {});
      }
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
      setB1chatVoiceState('result');
    };
    recognition.onerror = function (e) {
      isListening = false;
      setB1chatVoiceState('result');
      if (!resultText.textContent) resultText.textContent = '识别出错';
    };
    try { recognition.start(); } catch (err) {
      setB1chatVoiceState('result');
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
    setB1chatVoiceState('recording');
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
    if (layerRecording.classList.contains('active')) {
      if (finalTranscript) resultText.textContent = finalTranscript;
      setB1chatVoiceState('result');
    }
  }

  if (!SpeechRecognition) {
    resultText.textContent = '当前浏览器不支持语音识别';
    setB1chatVoiceState('result');
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
    if (e.target.closest('.b1chat-voice-send-btn') || e.target.closest('.b1chat-voice-back-btn')) return;
    if (e.target.closest('.b1chat-voice-result-text')) return;
    onPointerDown(e);
  });
  layerResult.addEventListener('mouseup', onPointerUp);
  layerResult.addEventListener('mouseleave', onPointerUp);
  layerResult.addEventListener('touchstart', function (e) {
    if (e.target.closest('.b1chat-voice-send-btn') || e.target.closest('.b1chat-voice-back-btn')) return;
    if (e.target.closest('.b1chat-voice-result-text')) return;
    e.preventDefault();
    onPointerDown(e);
  }, { passive: false });
  layerResult.addEventListener('touchend', function (e) { e.preventDefault(); onPointerUp(e); }, { passive: false });
  layerResult.addEventListener('touchcancel', function (e) { e.preventDefault(); onPointerUp(e); }, { passive: false });

  function docPointerUp(e) {
    if (!layerRecording.classList.contains('active')) return;
    if (e.target && (e.target.closest('.b1chat-voice-send-btn') || e.target.closest('.b1chat-voice-back-btn'))) return;
    onPointerUp(e);
  }
  document.addEventListener('mouseup', docPointerUp);
  document.addEventListener('touchend', docPointerUp, { passive: false });
  document.addEventListener('touchcancel', docPointerUp, { passive: false });

  function doBackToIdle() {
    resultText.textContent = '';
    setB1chatVoiceState('idle');
  }
  if (backBtn) {
    backBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      doBackToIdle();
    });
    backBtn.addEventListener('touchend', function (e) {
      e.preventDefault();
      e.stopPropagation();
      doBackToIdle();
    }, { passive: false });
  }
  function doSendFromResult() {
    var text = (resultText.textContent || '').trim();
    if (text) {
      sendVoiceMessage(text);
      resultText.textContent = '';
      setB1chatVoiceState('idle');
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

  setB1chatVoiceState('idle');
}

function openAudienceSheet() {
  var overlay = document.getElementById('b1chat-audience-overlay');
  var chip = document.getElementById('b1chat-audience-chip');
  if (!overlay || !chip) return;
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  chip.setAttribute('aria-expanded', 'true');
  // 同步弹窗内选中状态
  var items = document.querySelectorAll('.b1chat-sheet-item');
  items.forEach(function (item) {
    var id = item.getAttribute('data-audience');
    item.classList.toggle('selected', selectedAudienceIds.indexOf(id) !== -1);
  });
}

function closeAudienceSheet() {
  var overlay = document.getElementById('b1chat-audience-overlay');
  var chip = document.getElementById('b1chat-audience-chip');
  if (!overlay || !chip) return;
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  chip.setAttribute('aria-expanded', 'false');
}

function confirmAudienceSheet() {
  var items = document.querySelectorAll('.b1chat-sheet-item.selected');
  selectedAudienceIds = Array.from(items).map(function (item) {
    return item.getAttribute('data-audience');
  });
  updateAudienceChipText();
  closeAudienceSheet();
}

// 初始化
document.addEventListener('DOMContentLoaded', function () {
  // 初始化语音输入组件（完整功能）
  initB1chatVoiceInput();

  // 单个 chip：点击打开上拉弹窗
  var chip = document.getElementById('b1chat-audience-chip');
  var overlay = document.getElementById('b1chat-audience-overlay');
  var backdrop = document.getElementById('b1chat-audience-backdrop');
  var confirmBtn = document.getElementById('b1chat-audience-confirm');
  var list = document.getElementById('b1chat-audience-list');

  if (chip) {
    chip.addEventListener('click', openAudienceSheet);
  }
  if (backdrop) {
    backdrop.addEventListener('click', closeAudienceSheet);
  }
  if (confirmBtn) {
    confirmBtn.addEventListener('click', confirmAudienceSheet);
  }

  // 弹窗内列表项：点击切换选中（多选，像 @群成员）
  if (list) {
    list.addEventListener('click', function (e) {
      var item = e.target.closest('.b1chat-sheet-item');
      if (!item) return;
      item.classList.toggle('selected');
    });
  }

  // 初始：无人选中时 chip 保持空白
  updateAudienceChipText();
});

// 页面卸载时释放麦克风
window.addEventListener('beforeunload', function () {
  if (typeof b1chatVoiceReleaseMic === 'function') {
    b1chatVoiceReleaseMic();
  }
});

// Bubble2 展开态控制函数
function showBubble2Expanded() {
  var overlay = document.getElementById('b1chat-bubble2-overlay');
  if (overlay) {
    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
  }
}

function hideBubble2Expanded() {
  var overlay = document.getElementById('b1chat-bubble2-overlay');
  if (overlay) {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
  }
}

// Bubble3 展开态控制函数
function showBubble3Expanded() {
  var overlay = document.getElementById('b1chat-bubble3-overlay');
  if (overlay) {
    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
  }
}

function hideBubble3Expanded() {
  var overlay = document.getElementById('b1chat-bubble3-overlay');
  if (overlay) {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
  }
}

// 初始化 Bubble2 和 Bubble3 展开态事件
document.addEventListener('DOMContentLoaded', function () {
  var backdrop2 = document.getElementById('b1chat-bubble2-backdrop');
  if (backdrop2) {
    backdrop2.addEventListener('click', hideBubble2Expanded);
  }
  
  var backdrop3 = document.getElementById('b1chat-bubble3-backdrop');
  if (backdrop3) {
    backdrop3.addEventListener('click', hideBubble3Expanded);
  }
  
  // 导出到全局，方便外部调用
  window.showBubble2Expanded = showBubble2Expanded;
  window.hideBubble2Expanded = hideBubble2Expanded;
  window.showBubble3Expanded = showBubble3Expanded;
  window.hideBubble3Expanded = hideBubble3Expanded;
});
