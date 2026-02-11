// Service Worker - 基础版本，用于启用PWA功能
// 版本号用于更新缓存
const CACHE_NAME = 'digital-avatar-v3-bubble6';
const urlsToCache = [
  '/',
  '/index.html',
  '/Register2/index.html'
];

// 安装事件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: 缓存已打开');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Service Worker: 缓存失败', error);
      })
  );
  // 立即激活新的Service Worker
  self.skipWaiting();
});

// 激活事件
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 删除所有旧缓存（包括 v1）
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: 删除旧缓存', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 立即控制所有页面
      return self.clients.claim();
    })
  );
});

// 拦截请求
self.addEventListener('fetch', (event) => {
  // 对于API请求，直接使用网络
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果缓存中有，返回缓存
        if (response) {
          return response;
        }
        // 否则从网络获取
        return fetch(event.request).then((response) => {
          // 检查响应是否有效
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          // 克隆响应
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
      .catch(() => {
        // 网络失败时，可以返回离线页面
        return caches.match('/index.html');
      })
  );
});
