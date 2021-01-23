importScripts("https://www.gstatic.com/firebasejs/7.14.4/firebase-app.js");
importScripts('https://www.gstatic.com/firebasejs/7.14.4/firebase-messaging.js');


var firebaseConfig = {
    apiKey: "AIzaSyA77MLi9bpxiVH26g4nWQhRsAJ-YgmTOMw",
    authDomain: "eofficehuflit.firebaseapp.com",
    databaseURL: "https://eofficehuflit.firebaseio.com",
    projectId: "eofficehuflit",
    storageBucket: "eofficehuflit.appspot.com",
    messagingSenderId: "88413785331",
    appId: "1:88413785331:web:7bf948bf25147d2336fb86",
    measurementId: "G-6059WCMF0N"
};

const app = firebase.initializeApp(firebaseConfig);

const messaging = app.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    let data = JSON.parse(payload.data.data)
    const notificationTitle = data.title;
    const notificationOptions = {
        body: data.content,
        icon: '/firebase-logo.png',
        actions: [
            {
                action: 'xem',
                title: "Xem"
            }
        ],
        data: data.url

    };

    self.addEventListener('notificationclick', function (event) {
        event.notification.close();
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(windowClients => {
                // Check if there is already a window/tab open with the target URL
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    // If so, just focus it.
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                // If not, then open the target URL in a new window/tab.
                if (clients.openWindow) {
                    if (!event.action) {
                        return clients.openWindow(event.notification.data);
                        return;
                    }

                    switch (event.action) {
                        case 'xem':
                            return clients.openWindow(event.notification.data);
                    }
                    return clients.openWindow("https://aca.huflit.edu.vn/");
                }
            })
        )

    });

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});