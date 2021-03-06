function showAddTopicScreen(){
  renderTemplate("#createTopic-tmpl",{}, "wrapper");
  renderTemplate("#createTopicFooter-tmpl",{}, "footer")
}

function addNewTopic(){
  topicName = $("#createTopicName").val();
  topicDescription = $("#createTopicDescription").val();

  if (topicName == "") {
    alert("חסר שם נושא");
    return;
  }

  if (userUuid == "" || userUuid == undefined) {
    alert("אנא התחבר/י למערכת");
    return;
  }

  var newTopic = DB.child("topics").push({dateAdded: firebase.database.ServerValue.TIMESTAMP, title: topicName, description: topicDescription, owner: userUuid });
  if (activeEntity.entity == "groups"){
    var group = activeEntity.uid;
    DB.child("groups/"+group+"/topics/"+newTopic.key+"/dateAdded").set(firebase.database.ServerValue.TIMESTAMP);
  }
  DB.child("users/"+userUuid+"/topics/"+newTopic.key).set("owner");

  showGroup(activeEntity.uid);
}
