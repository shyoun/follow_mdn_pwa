// service worker

// games.js파일로부터 데이터 불러오기
// self는 스크립트가 실행되는 컨텍스트의 전역 객체를 반환하는 속성이다.
// 참조: https://geundung.dev/101
self.importScripts('data/games.js')

// 다음으로, app shell과 컨텐츠 모두로부터 캐싱할 모든 파일의 리스트를 생성합니다.
// 새 자원을 포함하는 앱의 새 버전이 사용가능할 때 어떻게 Service Worker를 업그레이드하나요? 
// 캐시 이름안의 버전 넘버가 핵심입니다.
// v2로 업데이트했을 때, 새 캐시에 모든 파일(새 파일들을 포함)을 추가할 수 있습니다.
var cacheName = 'js13kPWA-v1'
var appShellFiles = [
  '/pwa-examples/js13kpwa/',
  '/pwa-examples/js13kpwa/index.html',
  '/pwa-examples/js13kpwa/app.js',
  '/pwa-examples/js13kpwa/style.css',
  '/pwa-examples/js13kpwa/fonts/graduate.eot',
  '/pwa-examples/js13kpwa/fonts/graduate.ttf',
  '/pwa-examples/js13kpwa/fonts/graduate.woff',
  '/pwa-examples/js13kpwa/favicon.ico',
  '/pwa-examples/js13kpwa/img/js13kgames.png',
  '/pwa-examples/js13kpwa/img/bg.png',
  '/pwa-examples/js13kpwa/icons/icon-32.png',
  '/pwa-examples/js13kpwa/icons/icon-64.png',
  '/pwa-examples/js13kpwa/icons/icon-96.png',
  '/pwa-examples/js13kpwa/icons/icon-128.png',
  '/pwa-examples/js13kpwa/icons/icon-168.png',
  '/pwa-examples/js13kpwa/icons/icon-192.png',
  '/pwa-examples/js13kpwa/icons/icon-256.png',
  '/pwa-examples/js13kpwa/icons/icon-512.png'
]

var gamesImages = []
for (var i = 0; i < games.length; i++) {
  gamesImages.push('data/img/' + gaems[i].slug + '.jpg')
}

var contentToCache = appShellFiles.concat(gamesImages)

// 다음 블럭은 service worker를 설치하여 위의 목록에 포함된 모든 파일을 실제로 캐싱합니다.
self.addEventListener('install', function (e) {
  console.log('[Service Woker] Install')
  // ExtendableEvent.waitUntil: 안의 코드가 실행되기전까지 Service Worker가 설치되지 않습니다.
  // 설치에 시간이 걸릴 수도 있으므로 완료될 때까지 기다려야하기 때문에 이 접근법이 필요합니다.
  e.waitUntil(
    // caches는 데이터를 저장할 수 있도록 주어진 Service Worker 범위 내에서 사용할 수 있는
    // 특별한 객체입니다.
    caches.open(cacheName).then(function (cache) {
      console.log('[Service Worker] Caching all: app shell and content')
      return cache.addAll(contentToCache)
    })
  )
})

// 마지막으로, service worker는 가능한 경우 캐시로부터 컨텐츠를 패치하여 오프라인 기능을 제공합니다.
// 패치 응답:
// 처리를 위한 fetch 이벤트도 있습니다. 이는 앱으로부터 HTTP 요청이 출발할 때 마다 발생합니다. 이는 요청을 가로채 커스텀 응답으로 응답할 수 있어 매우 유용합니다.
// 다음은 간단한 사용 예시입니다.
self.addEventListener('fetch', function (e) {
  // FetchEvent.respondWith: 앱과 네트워크 사이의 프록시 서버로서 기능
  e.respondWith(
    // 캐쉬에 데이터 있는지 확인:
    caches.match(e.request).then(function (r) {
      console.log('[Service Worker] Fetching resource: ' + e.request.url)

      // 캐쉬 데이터 있으면 캐쉬 데이터 리턴 없으면 해당 url로 fetch 작업 수행
      return r || fetch(e.request).then(function (response) {
        return caches.open(cacheName).then(function (cache) {
          console.log('[Service Worker] Caching new resource: ' + e.request.url)
          cache.put(e.request, response.clone())

          return response
        })
      })
    })
  )
})

// 캐시 지우기
// 본 예제에서는 사용하지 않음.
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (cacheName.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});