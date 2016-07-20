
function clearChat(){
  $("wrapper").html("");
}
function showChat(chatUid, entityType){

  clearChat();
  
  setAcitveEntity("chats", chatUid);

  userUpdates = DB.child("users/"+userUuid+"/entityNotifications/"+activeEntity.entity+"/"+activeEntity.uid);

  userUpdates.once('value', function(data) {
    userUpdatesSet = data.child("globalNotifications").exists();
  });

  //create footer input box
  renderTemplate("#chatInput-tmpl",{},"footer");

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
  DB.child("chats/"+chatUid).orderByChild("time").limitToLast(20).on("child_added", function(chats){
    if(chats.exists()){
      var text = chats.val().text;
      var time =  parseDate(chats.val().time);
      var author = chats.val().userName;

      var context = {text:text, time: time, author:author};
      appendTemplate("#chatMessage-tmpl", context, "wrapper");

      $('wrapper').scrollTop($('wr apper')[0].scrollHeight);
    }

    if (userUpdatesSet) {
      $("#globalNotificationsSub").css("color", activeColor);
    } else {
      $("#globalNotificationsSub").css("color", inactiveColor);
    }
  })
}


function addChatMessage(chatUid, userUid, text, entityType){
  //  var x= firebase.database(app);
  if (text != "") {

    //get user name
    DB.child("users/"+userUid).once("value", function(user) {
      var userName = user.val().name;
      DB.child("chats/messages/"+chatUid).push({time: firebase.database.ServerValue.TIMESTAMP, user: userUid, userName:userName, text: text});

    })
  }
}


