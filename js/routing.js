function getUrl(){
  var currentUrl = window.location.href;
  var locationToCut = currentUrl.indexOf("?");
  currentUrl = currentUrl.substring(locationToCut+1);

  return currentUrl;
}

function routTo(currentUrl){

  //get type of refernce

  var slashPostion = currentUrl.indexOf("/");
  var currentType = currentUrl.slice(0,slashPostion);

  var currentEntety = currentUrl.slice(slashPostion+1);

  switch (currentType){
    case "group":
      DB.child("groups/"+currentEntety).once("value", function (group){
        if(group.exists()){
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
      console.log("type did not match");
  }

};

function setUrl(type, uid){

  //get domain
  var currentUrl = window.location.href;
  var locationToCut = currentUrl.indexOf("?");
  var domainUrl = currentUrl.slice(0,locationToCut);

  if(type == undefined || uid == undefined){
    history.pushState({}, uid, domainUrl );
  } else{

    var typeEntety = {type: type, entety: uid};

    var url = domainUrl+"?"+type+"/"+uid;
    history.pushState(typeEntety, uid, url );
  }


}
