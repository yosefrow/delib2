function getUrl(){
  var currentUrl = window.location.href;
  var locationToCut = currentUrl.indexOf("?");
  currentUrl = currentUrl.substring(locationToCut+1);
	return currentUrl;

}

function routTo(currentUrl, back){

  if (back == undefined){back = false};

  var slashPostion = currentUrl.indexOf("/");
  //var currentType = currentUrl.slice(0,slashPostion) || sessionStorage.getItem("_entityType");
  var currentType = sessionStorage.getItem("_entityType");

  //var currentEntity = currentUrl.slice(slashPostion+1);
  //var currentEntity = sessionStorage.getItem("_urlAfterLogin");
  var currentEntity = sessionStorage.getItem("_currentEntity");

  switch (currentType){
    case "group":
      DB.child("groups/"+currentEntity).once("value", function (group){
        if(group.exists()){
          showGroup(currentEntity, back);
        } else { console.log("group "+currentEntity+" do not exist"); }
      })
      break;
    case "topic":
      DB.child("topics/"+currentEntity).once("value", function (topic){
        if (topic.exists()){
          showTopic(currentEntity, back);
        } else { console.log("topic "+currentEntity+" do not exist");}
      })
      break;
    case "question":
      DB.child("questions/"+currentEntity).once("value", function (question){
        if (question.exists()){
          showQuestion(currentEntity, back);
        } else { console.log("question "+currentEntity+" do not exist");}
      })
      break;
    default:
      showPublicGroups();
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

    var typeEntity = {type: type, entity: uid};

    var url = domainUrl+"?"+type+"/"+uid;
    history.pushState(typeEntity, uid, url );
  }


}
