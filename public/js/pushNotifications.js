// Add feature check for Service Workers here
var reg;
var isSubscribed = false;
var sub;
var subscribeButton = $(document).ready(function() {return('#pushNotiificationsBtn');});


subscribeButton.click(function() {
    console.log("blblbsflblsdddddddd");
  if (isSubscribed) {

      console.log("blblbsflblsdddddddd222222222");
    unsubscribe();
  } else {
    subscribe();
  }
});
 
function subscribe() {
    reg.pushManager.subscribe({userVisibleOnly: true}).
    then(function(pushSubscription) {
        sub = pushSubscription;
        console.log('Subscribed! Endpoint:', sub.endpoint);
        subscribeButton.textContent = 'Unsubscribe';
        isSubscribed = true;
    });
}

function unsubscribe() {
    sub.unsubscribe().then(function(event) {
        subscribeButton.textContent = 'Subscribe';
        console.log('Unsubscribed!', event);
        isSubscribed = false;
    }).catch(function(error) {
        console.log('Error unsubscribing', error);
        subscribeButton.textContent = 'Subscribe';
    });
}