// Add feature check for Service Workers here
//var reg;
//var isSubscribed = false;
//var sub;
//var fcmNotificationsBtn = $(document).ready(function() {return('#pushNotiificationsBtn');});
////<< define localEntityNoticationsBtn ID >>
//var localEntityNoticationsBtn  = $(document).ready(function() {return('#');});
//
//fcmNotificationsBtn.click(function() {
//  if (isSubscribed) {
//    fcmUnsubscribe();
//  } else {
//    fcmSubscribe();
//  }
//});

function setLocalNotifications(){
  var entity = activeEntity.entity;
  var uid = activeEntity.uid;
  console.log("pressed: "+ entity+"/"+uid);

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
      userNotificationsDB.set(false);
    }
  })
}

//function fcmSubscribe() {
//    reg.pushManager.subscribe({userVisibleOnly: true}).
//    then(function(pushSubscription) {
//        sub = pushSubscription;
//        console.log('Subscribed! Endpoint:', sub.endpoint);
//        fcmNotificationsBtn.textContent = 'Unsubscribe';
//        isSubscribed = true;
//    });
//}
//
//function fcmUnsubscribe() {
//    sub.unsubscribe().then(function(event) {
//        fcmNotificationsBtn.textContent = 'Subscribe';
//        console.log('Unsubscribed!', event);
//        isSubscribed = false;
//    }).catch(function(error) {
//        console.log('Error unsubscribing', error);
//        fcmNotificationsBtn.textContent = 'Subscribe';
//    });
//}
