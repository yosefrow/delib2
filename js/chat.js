function showChat(chatUid){
  console.log("chat Uid: "+ chatUid);
}



function showChat(chatUid){
  console.log("chatUid: " + chatUid );
  $("wrapper").html("");

  //show 20 existing messages
  DB.child("chats/"+chatUid).orderByChild("time").limitToLast(20).on("value", function(chats){
    console.dir(chats.val());
    if (chats.exists()){
      chats.forEach(function(chat){
        console.log("chat key: "+chat.key);
        var text = chat.val().text;
        var time = chat.val().time;
        time = new Date(time);
        var user = chat.val().user;

        var context = {text:text, time: time, user: user, messageId: chatUid}

        appendTemplate("#chatMessage-tmpl", context, "wrapper");

      })
    }
//    console.log("hoop: "+ chats.val().text);
//    console.dir(chats.val());
  })



  convertTemplate("#chatInput-tmpl",{},"footer");

  //listen to enter from input
  $("#chatInputTxt").keypress(function (e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      console.log("enter!")
      var inputValue=$("#chatInputTxt").val();
      console.log(inputValue);
      addChatMessage(chatUid, userUuid, inputValue);
      $("#chatInputTxt").val("");
    }
  });

}

function addChatMessage(chatUid, userUid, text){
//  var x= firebase.database(app);
  DB.child("chats/"+chatUid).push({time: firebase.database.ServerValue.TIMESTAMP, user: userUid, text: text });
}
