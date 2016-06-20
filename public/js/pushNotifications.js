// Add feature check for Service Workers here
var reg;
var isSubscribed = false;
var sub;
var fcmNotificationsBtn = $(document).ready(function() {return('#pushNotiificationsSub');});
//<< define localEntityNoticationsBtn ID >>
var localEntityNoticationsBtn  = $(document).ready(function() {return('#globalNotificationsSub');});

fcmNotificationsBtn.click(function() {
 if (isSubscribed) {
   fcmUnsubscribe();
 } else {
   fcmSubscribe();
 }
});

localEntityNoticationsBtn.click(function () {
    var userEntityNotifications;
    
    if(activeEntity !== 'undefined'){
        userEntityNotifications = DB.child("users/"+userUuid+"/entityNotifications/"+activeEntity.entity+"/"+activeEntity.uid);
        userEntityNotifications.set(true);
    }
});


function setLocalNotifications(){
  var entity = activeEntity.entity;
  var uid = activeEntity.uid;

  var userNotificationsDB = DB.child("users/"+userUuid+"/localNotifications/"+entity+"/"+uid);

  userNotificationsDB.once("value", function(dataSnapshot){
    if (dataSnapshot.val() == true){
      userNotificationsDB.set(false);
      $("#globalNotifications").css("color", inactiveColor);
    } else {
      userNotificationsDB.set(true);
      $("#globalNotifications").css("color", activeColor);
    }
  })
}

function getLocalNotifications(){
  var entity = activeEntity.entity;
  var uid = activeEntity.uid;
  var userNotificationsDB = DB.child("users/"+userUuid+"/localNotifications/"+entity+"/"+uid);

  userNotificationsDB.once("value", function(localNotifications){

    if (localNotifications.val() == true){
      $("#globalNotifications").css("color", activeColor);
    } else {
      $("#globalNotifications").css("color", inactiveColor);
    }
  })
}

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

const subEntitys = {groups: "topics", topics: "questions", questions: "", chats: ""};


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
