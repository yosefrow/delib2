function showGroup(groupUid){

  DB.child("groups/"+groupUid).once("value", function(dataSnapshot){
    var title = dataSnapshot.val().title;
     convertTemplate("#headerTitle-tmpl", {group: title}, "#headerTitle");
  });

  showGroupTopics (groupUid);
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
          console.log("i = "+i+", numberOfTopics = "+ numberOfTopics);
          if (i === numberOfTopics){
              var context = {groups: topicsArray};
              convertTemplate("#groupPage-tmpl", context, "wrapper");
            console.log("Push"+ JSON.stringify(context));
          }
          console.log(i);
          i++;
        })

      })
    } else {convertTemplate("#groupPage-tmpl",{}, "wrapper");}
  });
}
