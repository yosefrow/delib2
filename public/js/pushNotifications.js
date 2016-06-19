// Add feature check for Service Workers here
var reg;
var isSubscribed = false;
var sub;
var fcmNotificationsBtn = $(document).ready(function() {return('#pushNotiificationsBtn');});
//<< define localEntityNoticationsBtn ID >>
var localEntityNoticationsBtn  = $(document).ready(function() {return('#');});

fcmNotificationsBtn.click(function() {
  if (isSubscribed) {
    fcmUnsubscribe();
  } else {
    fcmSubscribe();
  }
});

localEntityNoticationsBtn.click(function () {
    var currentEntity = , currentEntityId = ;
    
    DB.child("users/"+userUuid).set('entityNotifications').set('entity')
    
});

function fcmSubscribe() {
    reg.pushManager.subscribe({userVisibleOnly: true}).
    then(function(pushSubscription) {
        sub = pushSubscription;
        console.log('Subscribed! Endpoint:', sub.endpoint);
        fcmNotificationsBtn.textContent = 'Unsubscribe';
        isSubscribed = true;
    });
}

function fcmUnsubscribe() {
    sub.unsubscribe().then(function(event) {
        fcmNotificationsBtn.textContent = 'Subscribe';
        console.log('Unsubscribed!', event);
        isSubscribed = false;
    }).catch(function(error) {
        console.log('Error unsubscribing', error);
        fcmNotificationsBtn.textContent = 'Subscribe';
    });
}