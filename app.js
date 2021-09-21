// template 기반으로 컨텐츠 생성. index.html content 엘리먼트에 들어간다.
var template = "<article>\n\
    <img src='data/img/SLUG.jpg' alt='NAME'>\n\
    <h3>#POS. NAME</h3>\n\
    <ul>\n\
    <li><span>Author:</span> <strong>AUTHOR</strong></li>\n\
    <li><span>Twitter:</span> <a href='https://twitter.com/TWITTER'>@TWITTER</a></li>\n\
    <li><span>Website:</span> <a href='http://WEBSITE/'>WEBSITE</a></li>\n\
    <li><span>GitHub:</span> <a href='https://GITHUB'>GITHUB</a></li>\n\
    <li><span>More:</span> <a href='http://js13kgames.com/entries/SLUG'>js13kgames.com/entries/SLUG</a></li>\n\
    </ul>\n\
</article>";
var content = '';
for (var i = 0; i < games.length; i++) {
  var entry = template.replace(/POS/g, (i + 1))
    .replace(/SLUG/g, games[i].slug)
    .replace(/NAME/g, games[i].name)
    .replace(/AUTHOR/g, games[i].author)
    .replace(/TWITTER/g, games[i].twitter)
    .replace(/WEBSITE/g, games[i].website)
    .replace(/GITHUB/g, games[i].github);
  entry = entry.replace('<a href=\'http:///\'></a>', '-');
  content += entry;
};
document.getElementById('content').innerHTML = content;

// service worker 등록
// 브라우저에서 Srvice Worker API를 지원한다면 ServiceWorkerContainer.register() 메소드를 사용해 사이트에 대해 등록
// 컨텐츠는 sw.js파일안에 있으며 등록이 성공한 후에 실행
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/pwa-examples/js13kpwa/sw.js')
}

// 버튼 클릭 시 알림 권한 요청
var button = document.getElementById("notifications");
button.addEventListener('click', function (e) {
  Notification.requestPermission().then(function (result) {
    if (result === 'granted') {
      randomNotification();
    }
  });
});

// 게임 리스트로부터 랜덤하게 선택된 항목을 나타내는 알림을 생성합니다.
function randomNotification() {
  var randomItem = Math.floor(Math.random() * games.length);
  var notifTitle = games[randomItem].name;
  var notifBody = 'Created by ' + games[randomItem].author + '.';
  var notifImg = 'data/img/' + games[randomItem].slug + '.jpg';
  var options = {
    body: notifBody,
    icon: notifImg
  }
  var notif = new Notification(notifTitle, options);
  setTimeout(randomNotification, 30000);
}
