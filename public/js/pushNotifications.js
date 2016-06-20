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

    var userEntityNotifications = DB.child("users/"+userUuid+"/entityNotifications");


  if (userEntityNotifications.exists) {
    if (userEntityNotifications.child(activeEntity.entity).exists) {
      // used set() instead of push() in order to avoid creating notification UID needlessly
      // userID: { ...
      //         entityNotifications: {
      //             groups: groupUid1, groupUid2, ...
      //             topic: topicUid1, topicUid2, ...
      //             etc..
      console.log("blalalalaladcdsvsd!@WE#!RQ#R@#R3333333333333333333333333");
      userEntityNotifications.set(activeEntity.uid);
    } else {
      // userentityNotifications.set(activeEntety.entity);
      // userentityNotifications.child(activeEntety.entity).set(activeEntety.uid);
      userEntityNotifications.set(activeEntity.entity).set(activeEntity.uid);
    }
  } else {
    // console.log("blalalalaladcdsvsd!@WE#!RQ#R@#R");
    // userEntityNotifications = DB.child("users/"+userUuid);
    // var entityNotifications = {};
    // key = activeEntity.entity;
    // entityNotifications[key] = {};
    // entityNotifications[key][activeEntity.uid] = true;
    // console.dir(activeEntity+ " "+ entityNotifications);
    // userEntityNotifications.set(entityNotifications);
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
