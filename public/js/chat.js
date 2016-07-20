
function clearChat(){
  $("wrapper").html("");
}
function showChat(chatUid, entityType){

  activeEntity = {
    entity: "chats",
    uid: chatUid
  };

//  userEntityNotifications = DB.child("users/"+userUuid+"/entityNotifications/"+activeEntity.entity+"/"+activeEntity.uid);
//
//  userEntityNotifications.once('value', function(data) {
//    userEntityNotificationsExists = data.child("globalNotifications").exists();
//
//    console.dir(userEntityNotificationsExists);
//
//  });

  clearChat();
  console.log("goo");
  setAcitveEntity("chats", chatUid);

  //create footer input box
  convertTemplate("#chatInput-tmpl",{},"footer");

  //listen to enter from input
  $("#chatInputTxt").keypress(function (e) {
    if (e.keyCode == 13) {
      e.preventDefault();

      var inputValue=$("#chatInputTxt").val();
      addChatMessage(chatUid, userUuid, inputValue, entityType);
      $("#chatInputTxt").val("");
    }
  });

  //get chat messages
  DB.child("chats/"+chatUid).off();
  DB.child("chats/"+chatUid+"/messages").orderByChild("time").limitToLast(20).on("child_added", function(chats){
    if(chats.exists()){
      var text = chats.val().text;
      var time =  parseDate(chats.val().time);
      var author = chats.val().userName;

      var context = {text:text, time: time, author:author};
      appendTemplate("#chatMessage-tmpl", context, "wrapper");

      $('wrapper').scrollTop($('wrapper')[0].scrollHeight);
    }

    if (userEntityNotificationsExists) {
      $("#globalNotificationsSub").css("color", activeColor);
    } else {
      $("#globalNotificationsSub").css("color", inactiveColor);
    }
  })
}


function addChatMessage(chatUid, userUid, text, entityType){
  //  var x= firebase.database(app);
  if (text != ""){

    //get user name
    DB.child("users/"+userUid).once("value", function(user){

      var userName = user.val().name;      
      DB.child("chats/"+chatUid).push({time: firebase.database.ServerValue.TIMESTAMP, user: userUid, userName:userName, text: text});
    })
  }
}


