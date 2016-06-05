function getUrl(){
  var currentUrl = window.location.href;
  console.log("url: "+currentUrl);
  var locationToCut = currentUrl.indexOf("?");
  currentUrl = currentUrl.substring(locationToCut+1);
  console.log("url: "+currentUrl);

  return currentUrl;
}

function routTo(currentUrl){

  //get type of refernce

  var slashPostion = currentUrl.indexOf("/");
  var currentType = currentUrl.slice(0,slashPostion);
  console.log("type: "+ currentType);
  var currentEntety = currentUrl.slice(slashPostion+1);
  console.log("Entety: "+ currentEntety);

  switch (currentType){
    case "group":
      DB.child("groups/"+currentEntety).once("value", function (group){
        if(group.exists()){
          console.log("group "+currentEntety+" exists");
          showGroup(currentEntety);
        } else { console.log("group "+currentEntety+" do not exist"); }
      })
      break;
    case "topic":
      DB.child("topics/"+currentEntety).once("value", function (topic){
        if (topic.exists()){
          showTopic(currentEntety);
        } else { console.log("topic "+currentEntety+" do not exist");}
      })
      break;
    case "question":
      DB.child("questions/"+currentEntety).once("value", function (question){
        if (question.exists()){
          showQuestion(currentEntety);
        } else { console.log("question "+currentEntety+" do not exist");}
      })
      break;
    default:
      console.log("did not match");
  }

}
