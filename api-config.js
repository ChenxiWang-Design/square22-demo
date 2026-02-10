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
    return 'https://square22-demo-production.up.railway.app'; // Railway部署的API地址
  }
})();

// 设置全局变量，供register2.js使用
window.API_BASE_URL = API_BASE_URL;

console.log('API Base URL:', API_BASE_URL);
