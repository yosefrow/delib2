//create new topic
function createNewTopic(title, description, explanation, imgTopic){

  if (title == undefined){
    title = "";
    console.log("Error: new topic do not have title");
  };

  if (description == undefined){
    description = "";
  };
  if (explanation == undefined){
    explanation = "";
  };
  if (imgTopic == undefined){
    imgTopic = "";
  };

  DB.child("topics").push({title: title, description: description, explanation: explanation, imgTopic: imgTopic});
}

function showTopic(topicUid){

  activeEntity = {
    entity: "topics",
    uid: topicUid
  };

  
  setNewEntity("topics", topicUid);

  //show header
  DB.child("topics/"+topicUid).once("value", function(dataSnapshot){
    if(dataSnapshot.exists()){
      setUrl("topic", topicUid);
    }
    var title = dataSnapshot.val().title;
    convertTemplate("#topicHeaderTitle-tmpl", {topic: title}, "#headerTitle");
    convertTemplate("#headerMenu-tmpl", {chatUid: topicUid}, "#headerMenu");
    getLocalNotifications();
  });
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
            $(".cardsTopicsSubmenuDotsMenu").hide()

          } 

          i++;
        })

      })
    } else {convertTemplate("#topicPage-tmpl",{}, "wrapper");}
  });
}

function openMenu(menuID){
  console.log($("#questionMenu"+menuID).is(':visible'))
  if ($("#questionMenu"+menuID).is(':visible')){
    $("#questionMenu"+menuID).hide(400);
  } else {
    $("#questionMenu"+menuID).show(400);
  }


}
