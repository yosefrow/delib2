function showChat(chatUid){
  console.log("chat Uid: "+ chatUid);
}



function showChat(chatUid){

  //show 20 existing messages
  DB.child("chats/"+chatUid).orderByChild("time").limitToLast(20).on("value", function(chats){

    $("wrapper").html("<div id='messages'></div>");
    if (chats.exists()){
      chats.forEach(function(chat){

        var text = chat.val().text;
        var time =  parseDate(chat.val().time);
        var author = chat.val().user;

        DB.child("users/"+author).once("value", function(dataSnapshot){
          if (dataSnapshot.exists()){
            var user = new Object;
            user.firstName = dataSnapshot.val().first_name;
            user.lastName = dataSnapshot.val().last_name;
            var context = {text:text, time: time, userName: user.firstName, userLast: user.lastName, messageId: chatUid}

            appendTemplate("#chatMessage-tmpl", context, "#messages");
//            var messagesDiv = document.getElementById("messages");
//            var messagesHeight = $("#messages").height();
//            console.log(messagesHeight);
////            messagesDiv.scrollTop = messagesHeight;
//            $("#messages").scrollTop(500);
            $('wrapper').scrollTop($('wrapper')[0].scrollHeight);
          } else {
            $("wrapper").html("<div id='messages'></div>");
          }
        })
      })
//      $("wrapper").animate({ scrollTop: $('wrapper').prop("scrollHeight")}, 1000);
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
