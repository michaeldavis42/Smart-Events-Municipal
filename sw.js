self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/2344/2344007.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/2344/2344007.png',
    vibrate: [200, 100, 200]
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
