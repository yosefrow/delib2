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

DB.child("groups").on('child_changed', function(EntityData) {
    DB.child("users/" + userUuid + "/entityNotifications/groups").once("value" ,function (data) {
        data.forEach(function (childSnapshot) {
            if (childSnapshot.key == EntityData.key)
                console.dir(EntityData.key);
                pushNotification(EntityData, "groups");
        });
    });
});

DB.child("topics").on('child_changed', function(EntityData) {
    DB.child("users/" + userUuid + "/entityNotifications/topics").once("value" ,function (data) {
        data.forEach(function (childSnapshot) {
            if (childSnapshot.key == EntityData.key)
                console.dir(EntityData.key);
                pushNotification(EntityData, "topics");
        });
    });
});

DB.child("questions").on('child_changed', function(EntityData) {
    DB.child("users/" + userUuid + "/entityNotifications/questions").once("value" ,function (data) {
        data.forEach(function (childSnapshot) {
            if (childSnapshot.key == EntityData.key)
                console.dir(EntityData.key);
                pushNotification(EntityData, "questions");
        });
    });
});


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


//------Local Notifications List-------

function setLocalNotifications(){
  var entity = activeEntity.entity;
  var uid = activeEntity.uid;

  var userNotificationsDB = DB.child("users/"+userUuid+"/localNotifications/"+entity+"/"+uid);

  userNotificationsDB.once("value", function(dataSnapshot){
    if (dataSnapshot.val() == true){
      userNotificationsDB.set(false);
      $("#feedSubscribe").css("color", inactiveColor);
    } else {
      userNotificationsDB.set(true);
      $("#feedSubscribe").css("color", activeColor);
    }
  })
}

function getLocalNotifications(){
  var entity = activeEntity.entity;
  var uid = activeEntity.uid;
  var userNotificationsDB = DB.child("users/"+userUuid+"/localNotifications/"+entity+"/"+uid);

  userNotificationsDB.once("value", function(localNotifications){

    if (localNotifications.val() == true){
      $("#feedSubscribe").css("color", activeColor);
    } else {
      $("#feedSubscribe").css("color", inactiveColor);
    }
  })
}

const subEntitys = {groups: "topics", topics: "questions", questions: "", chats: ""};

function showLocalNotifications(){

  //get active notifications
  DB.child("users/"+userUuid+"/localNotifications").on("value", function(notifications){
    notifications.forEach(function(entityNotifications){

      var entity = entityNotifications.key;
      var curSubEntity = subEntitys[entity];

      //for each registerd notification set "on"
      jQuery.each(entityNotifications.val(), function(uid, active){
        //        console.log("entity: "+entity+", uid: "+ uid + ", active: "+ active);
        if(active){  //activate path

          console.log("on path: "+ entity+"/"+uid+"/"+curSubEntity);
          DB.child(entity+"/"+uid+"/"+curSubEntity).on("child_added", function(entityUpdate){

            console.log("child added: "+ entityUpdate.key );

          });
        } else {   //diactivate path
          console.log("off path: "+ entity+"/"+uid+"/"+curSubEntity);
          DB.child(entity+"/"+uid+"/"+curSubEntity).off();
        }
      })
    })

  })
}




