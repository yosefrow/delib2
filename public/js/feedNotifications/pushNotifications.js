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
    // console.log('Subscribed! Endpoint:', subFcm.endpoint);
    $('#fcmPushNotiificationsBtn').prop('value', 'Unsubscribe');
    isSubscribed = true;
  });
}

function fcmUnsubscribe() {
  subFcm.unsubscribe().then(function(event) {
    $('#fcmPushNotiificationsBtn').prop('value', 'Subscribe');
    // console.log('Unsubscribed!', event);
    isSubscribed = false;
  }).catch(function(error) {
    // console.log('Error unsubscribing', error);
    $('#fcmPushNotiificationsBtn').prop('value', 'Subscribe');
  });
}


//------Local Chrome Notifications-------


function setGlobalNotifications() {

    if(activeEntity !== 'undefined') {

        console.log(activeEntity);

        if (userUpdatesSet)
        {
            if (activeEntity.entity !== "chats")
                userUpdates.child("globalNotifications").remove();
            else
                userUpdates.child("inboxMessages").remove();

            $("#globalNotificationsSub").css("color", inactiveColor);
        
        } else {
            if (activeEntity.entity !== "chats")
                userUpdates.child("globalNotifications").set(true);
            else
                userUpdates.child("inboxMessages").set(0);
            
            $("#globalNotificationsSub").css("color", activeColor);
        }

        userUpdates.once('value', function(data) {

            if (activeEntity.entity == "chats")
                userUpdatesSet = data.child("inboxMessages").exists();
            else
                userUpdatesSet = data.child("newSubEntity").exists();
        });


    }
  }



function pushNotification(EntityData, entityType, messagesSent) {

  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chrome.');
    return;
  }

  if (Notification.permission !== "granted")
    Notification.requestPermission(EntityData);
  else {
      var notification;
    console.log(EntityData.val(), entityType );
      if (entityType == "chats") {
          notification = new Notification(EntityData.val().title, {
              icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
              body: messagesSent + " הודעות חדשות"
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
          case "chats": showChat(EntityData.key); break; //look for change in showChat function... lets talk about it (Tal);
          case "ownerCalls": showGroup(EntityData.key);
          // for a later use
          // case "options": showOptionInfo(EntityData.key); break;
      }
    };
  }
}
