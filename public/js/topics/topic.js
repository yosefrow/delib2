//create new topic
function showTopic(topicUid, back){

  if (back == undefined){back = false}

  //  activeEntity = {
  //    entity: "topics",
  //    uid: topicUid
  //  };

  userEntityNotifications = DB.child("users/"+userUuid+"/entityNotifications/"+activeEntity.entity+"/"+activeEntity.uid);

  userEntityNotifications.once('value', function(data) {
    userEntityNotificationsExists = data.child("globalNotifications").exists();
  });





  var showTopicCallback = function(dataSnapshot){
    if(dataSnapshot.exists()){
      if (!back){
        setUrl("topic", topicUid);
      }
    }
    var title = dataSnapshot.val().title;
    convertTemplate("#topicHeaderTitle-tmpl", {topic: title}, "#headerTitle");
    $("#headerTitle").fadeIn(50).fadeOut(50).fadeIn(50);
    convertTemplate("#headerMenu-tmpl", {chatUid: topicUid, entityType: "topics"}, "#headerMenu");
    // getLocalNotifications();

    //    console.dir(userEntityNotificationsExists);

    if (userEntityNotificationsExists) {
      $("#globalNotificationsSub").css("color", activeColor);
    } else {
      $("#globalNotificationsSub").css("color", inactiveColor);
    }

  };

  setAcitveEntity("topics", topicUid, "value", showTopicCallback);
  //show questions in topic
  showTopicQuestions (topicUid);



}

//show topic questions
function showTopicQuestions(topicUid){

  //get topic questions
  DB.child("topics/"+ topicUid.toString()+"/questions").once("value",function(questions){

    if(questions.exists()){

      var questionsUnderTopic = questions.val();
      var numberOfQuestions = Object.keys(questionsUnderTopic).length;

      var questionsArray = new Array();

      var i = 1;

      questions.forEach(function(question){

        DB.child("questions/"+question.key).once("value", function(data){

          var preContext = new Object();

          if (data.exists()){

            var title = data.val().title;
            var description = data.val().description;
            //          console.log("t: "+ title + ", d: "+ description);

            preContext = {
              uuid: question.key,
              title: title,
              description: description
            }

            questionsArray.push(preContext);
          }

          if (i === numberOfQuestions){
            var context = {questions: questionsArray};
            convertTemplate("#topicPage-tmpl", context, "wrapper");
            $("wrapper").hide();
            $("wrapper").show(700);

          }

          i++;
        })

      })
    } else {convertTemplate("#topicPage-tmpl",{}, "wrapper");}
  });
}

