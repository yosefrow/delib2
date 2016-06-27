// Add feature check for Service Workers here
var SWreg;
var isSubscribed = false;
var subFcm;


// Request notifications permission on page load

document.addEventListener('DOMContentLoaded', function () {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
});


//------External FCM Notifications-------

function sefFcmPushNotiifications() {
 if (isSubscribed) {
   fcmUnsubscribe();
 } else {
   fcmSubscribe();
 }
}

function fcmSubscribe() {
    SWreg.pushManager.subscribe({userVisibleOnly: true}).
    then(function(pushSubscription) {
        subFcm = pushSubscription;
        console.log('Subscribed! Endpoint:', subFcm.endpoint);
        $('#fcmPushNotiificationsBtn').prop('value', 'Unsubscribe');
        isSubscribed = true;
    });
}

function fcmUnsubscribe() {
    subFcm.unsubscribe().then(function(event) {
        $('#fcmPushNotiificationsBtn').prop('value', 'Subscribe');
        console.log('Unsubscribed!', event);
        isSubscribed = false;
    }).catch(function(error) {
        console.log('Error unsubscribing', error);
        $('#fcmPushNotiificationsBtn').prop('value', 'Subscribe');
    });
}


//------Local Chrome Notifications-------


function setGlobalNotifications() {

    userEntityNotifications.on('value', function(data) {
        userEntityNotificationsExists = data.val() !== null;
    });

    if(activeEntity !== 'undefined') {

        console.dir(userEntityNotificationsExists);
        if (userEntityNotificationsExists)
        {

            DB.child("users/"+userUuid+"/entityNotifications/"+activeEntity.entity+"/"+activeEntity.uid).remove();
            $("#globalNotificationsSub").css("color", inactiveColor);
            console.log('Unsubscribed!');
        } else {
            DB.child("users/"+userUuid+"/entityNotifications/"+activeEntity.entity+"/"+activeEntity.uid).set(true);

            $("#globalNotificationsSub").css("color", activeColor);
            console.log('Subscribed!');

        }
    }
}


function pushNotification(EntityData, entityType) {

    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission(EntityData);
    else {
        var notification = new Notification(EntityData.val().title, {
            icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
            body: EntityData.val().description
        });

        notification.onclick = function () {
            switch (entityType){
                case "groups": showGroup(EntityData.key); break;
                case "topics": showGroup(EntityData.key); break;
                case "questions": showGroup(EntityData.key); break;
            }
        };

    }

}






