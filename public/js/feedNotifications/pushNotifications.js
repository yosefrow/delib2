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

    if(activeEntity !== 'undefined') {

        console.dir(userUpdatesSet);

        var GlobalNotifications = DB.child("users/"+userUuid+"/entityNotifications/"+activeEntity.entity+"/"+activeEntity.uid+"/notificaions/");

        if (activeEntity.entity !== "chats")
            GlobalNotifications.child("globalNotifications").set(true);
        else
            GlobalNotifications.child("globalNotifications").set(0);
        
        if (userUpdatesSet)
        {
            GlobalNotifications.child("newSubEntity").remove();
            $("#globalNotificationsSub").css("color", inactiveColor);
            console.log('Unsubscribed!');
        } else {
                GlobalNotifications.child("newSubEntity").set(true);

            $("#globalNotificationsSub").css("color", activeColor);
            console.log('Subscribed!');
        }

        userUpdates.once('value', function(data) {
            userUpdatesSet = data.child("newSubEntity").exists();
        });

    }
  }



function pushNotification(EntityData, entityType, messagesSent) {

  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.');
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission(EntityData);
  else {
      var notification;
    console.log(EntityData.val(), entityType );
      if (entityType == "chats") {
          notification = new Notification(toHebrew[entityType] + EntityData.val().title, {
              icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
              body: messagesSent
          });
      } else if(entityType == "ownerCalls") {
          notification = new Notification("קריאת מנהל מ"+EntityData.val().title, {
              icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
              body: messagesSent
          });
      } else {
          notification = new Notification(EntityData.val().title, {
              icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
              body: EntityData.val().description
          });
      }

    notification.onclick = function () {
      switch (entityType){
          case "groups": showGroup(EntityData.key); break;
          case "topics": showTopic(EntityData.key); break;
          case "questions": showQuestion(EntityData.key); break;
          case "chats": showChat(EntityData.key); break;
          case "ownerCalls": showGroup(EntityData.key);
          // for a later use
          // case "options": showOptionInfo(EntityData.key); break;
      }
    };
  }
}
