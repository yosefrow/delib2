<<<<<<< HEAD
=======
// function listenToNotifications (uuid){
//
//    listenToChats(uuid);
//
// }
//
// function listenToChats(uuid){
//    //listen or unlisten to chats
//
//    chatsDB = DB.child("users/"+uuid+"/updates/chats");
//
//    chatsDB.on("child_added", function(notification){
//
//       DB.child("chats/"+notification.key).limitToLast(2).on("child_added",listenToChats)
//    });
//
//    chatsDB.on("child_removed", function(notification){
//       DB.child("chats/"+notification.key).off("child_added", listenToChats)
//    });
//
//    var listenToChats = function(newMessage){
//       var massegeTime = parseDate(newMessage.val().dateAdded)
//       console.log(newMessage.key, newMessage.val().userName, newMessage.val().text, massegeTime, newMessage.val().chatUid, newMessage.val().entityType);
//    }
// }
>>>>>>> activeEntity
