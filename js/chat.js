function showChat(chatUid){
  console.log("chat Uid: "+ chatUid);
}



function clearChat(){
  $("wrapper").html("");
}
function showChat(chatUid){

  clearChat();

  //create footer input box
  convertTemplate("#chatInput-tmpl",{},"footer");

  //listen to enter from input
  $("#chatInputTxt").keypress(function (e) {
    if (e.keyCode == 13) {
      e.preventDefault();

      var inputValue=$("#chatInputTxt").val();
      addChatMessage(chatUid, userUuid, inputValue);
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

      $('wrapper').scrollTop($('wrapper')[0].scrollHeight);
    }
  })
}


function addChatMessage(chatUid, userUid, text){
  //  var x= firebase.database(app);
  if (text != ""){

    //get user name
    DB.child("users/"+userUid).once("value", function(user){
      var userName = user.val().name;
      DB.child("chats/"+chatUid).push({time: firebase.database.ServerValue.TIMESTAMP, user: userUid, userName:userName, text: text});
    })
  }
}


