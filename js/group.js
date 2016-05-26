function showGroup(groupUid){
  console.log(groupUid);

  DB.child("groups/"+groupUid).once("value", function(dataSnapshot){
    var title = dataSnapshot.val().title;
     convertTemplate("#headerTitle-tmpl", {group: title}, "#headerTitle");
  });
}

//show group topics
function showGroupTopics(groupUid){
  //get group topics
  DB.child("groups/"+groupUid).on("value",function(topics){
    var topicsArray = new Array();
    var topicsUnderGroup = topics.val();
    var numberOfTopics = Object.keys(topicsUnderGroup).length;

    var i = 1;
    topics.forEach(function(topic){
      var preContext = new Object();
      DB.child("topics/"+topic).once(function(data){
        var title = data.val().title;
        var description = data.val().description;

        preContext = {
          uuid: topic.key,
          title: title,
          description: description
        }

        topicsArray.push(preContext);

        if (i === numberOfTopics){
            var context = {groups: groupsArray};
            convertTemplate("#groups_"+role+"-tmpl", context, "wrapper");
          }
          i++;
      })
    })
  });
}
