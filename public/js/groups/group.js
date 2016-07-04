function showGroup(groupUid, back){

  if (back == undefined){back = false}

  activeEntity = {
    entity: "groups",
    uid: groupUid
  };
  
  userEntityNotifications = DB.child("users/"+userUuid+"/entityNotifications/"+activeEntity.entity+"/"+activeEntity.uid);

  userEntityNotifications.once('value', function(data) {
    userEntityNotificationsExists = data.child("globalNotifications").exists();

    console.dir(userEntityNotificationsExists);

  });

  setNewEntity("groups", groupUid);
  //get state of notifications


  //  $("globalNotifications").click(function())
  if(!back){
    setUrl("group", groupUid);
  }

  DB.child("groups/"+groupUid).once("value", function(dataSnapshot){
    var title = dataSnapshot.val().title;
    convertTemplate("#groupHeaderTitle-tmpl", {group: title}, "#headerTitle");
    convertTemplate("#headerMenu-tmpl", {chatUid: groupUid}, "#headerMenu");
    //    getLocalNotifications();
    if (userEntityNotificationsExists) {
      $("#globalNotificationsSub").css("color", activeColor);
    } else {
      $("#globalNotificationsSub").css("color", inactiveColor);
    }
  });

  isMembership();



  showGroupTopics (groupUid);
  $("footer").html("");
}


//show group topics
function showGroupTopics(groupUid){
  //get group topics

  DB.child("groups/"+ groupUid.toString()+"/topics").on("value",function(topics){

    if(topics.exists()){

      var topicsUnderGroup = topics.val();
      var numberOfTopics = Object.keys(topicsUnderGroup).length;
      var topicsArray = new Array();

      var i = 1;

      topics.forEach(function(topic){

        DB.child("topics/"+topic.key).once("value", function(data){

          var preContext = new Object();

          if (data.exists()){

            var title = data.val().title;
            var description = data.val().description;
            //          console.log("t: "+ title + ", d: "+ description);

            preContext = {
              uuid: topic.key,
              title: title,
              description: description
            }

            topicsArray.push(preContext);
          }

          if (i === numberOfTopics){
            var context = {groups: topicsArray};
            convertTemplate("#groupPage-tmpl", context, "wrapper");
//            $(".cardsTopicsSubmenuDotsMenu").hide();
          }

          i++;
        })

      })
    } else {convertTemplate("#groupPage-tmpl",{}, "wrapper");}
  });
}
