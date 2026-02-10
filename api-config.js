/**
 * API配置
 * 部署到公网后，修改这里的API地址为Railway部署的地址
 */

// 本地开发：使用 localhost
// const API_BASE_URL = 'http://localhost:3000';

// 公网部署：使用Railway地址（部署后替换）
// const API_BASE_URL = 'https://your-api.up.railway.app';

// 自动检测：如果在公网环境，使用公网API；否则使用本地API
const API_BASE_URL = (() => {
  // 检查是否在localhost或127.0.0.1
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000'; // 本地开发
  } else {
    // 公网环境，使用Railway API地址
    const railwayUrl = 'https://square22-demo-production.up.railway.app';
    console.log('[API Config] 使用Railway API:', railwayUrl);
    console.log('[API Config] 当前访问地址:', window.location.href);
    return railwayUrl; // Railway部署的API地址
  }
})();

// 添加API健康检查（可选，不阻塞页面加载）
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  // 延迟检查，不阻塞页面加载
  setTimeout(() => {
    fetch(`${API_BASE_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(5000) })
      .then(res => {
        if (res.ok) {
          console.log('[API Health] Railway API服务正常');
        } else {
          console.warn('[API Health] Railway API响应异常:', res.status);
        }
      })
      .catch(err => {
        console.warn('[API Health] 无法连接到Railway API:', err.message);
      });
  }, 2000);
}

// 设置全局变量，供register2.js使用
window.API_BASE_URL = API_BASE_URL;

console.log('API Base URL:', API_BASE_URL);
