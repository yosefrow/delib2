var groupsDB = DB.child("groups");

function showMemberGroupsPage(){
  
  var groupsPublicTmpl = $("#groupsMember-tmpl").html();
  var groupPublicHandl = Handlebars.compile(groupsPublicTmpl);
  var groupPublicHTML = groupPublicHandl(memberContext);    
    $("wrapper").html(groupPublicHTML); 
      
    
}

function showPublicGroups(){  
  
  startListeningToPageDB("public", "groupsGeneral-tmpl");

}

function showOwnedGroupsPage(){
  startListeningToPageDB("secret", "ownedGroups-tmpl")   
}

// ------------------------------------
function stopListeningToPageDB (page){
  
}

function startListeningToPageDB (type, template){
  
//  var groupsPublicTmpl = $("#"+template).html();
//  var groupPublicHandl = Handlebars.compile(groupsPublicTmpl);
  
  groupsDB.orderByChild("type").equalTo(type).on("value", function(groups){
    var groupsArray = new Array();
    var groupsDetails = new Object();
    
    groups.forEach(function(group){
      var newGroup = group.val();
      var groupDetials = {
        "uuid": group.key(),
        "title": newGroup.title,
        "description": newGroup.description
      };
      
      groupsArray.push(groupDetials);
    })    
    
    var context = {"groups": groupsArray}
    
//    var groupPublicHTML = groupPublicHandl(context);    
//    $("wrapper").html(groupPublicHTML); 
    
    convertTemplate("#"+template, context, "wrapper")
    
  })
}

function showUserGroups(){
  
  var context = {"groups": groupsArray};; 
    
  convertTemplate("#groupsMember-tmpl", context,"wrapper" )
  
}



var userGroupsArray = new Array();
var memberContext = new Object();

function getUserGroups(user){
  
  var userDB = DB.child("users/"+user+"/groups/member");
  userDB.on("value", function(groups){
    userGroupsArray = [];
    groups.forEach(function(group){      
      userGroupsArray.push(group.val());
    })
    console.log("1: "+userGroupsArray)
    
    //create Member Context
    
    var groupsArray = new Array();
    var groupsDetails = new Object();
    
    for (i in userGroupsArray){
      groupsDB.child(userGroupsArray[i]).once("value", function(group){
        
        if (group.exists()){
          var newGroup = group.val();
          var groupDetials = {
            "uuid": group.key(),
            "title": newGroup.title,
            "description": newGroup.description
          };
          groupsArray.push(groupDetials);
        }
      })
    }
    memberContext = {"groups": groupsArray}
    showMemberGroupsPage();
    console.log("mc: " + JSON.stringify(memberContext));
  })
  console.log("2: "+userGroupsArray)
  
}

