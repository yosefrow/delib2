const groupsDB = DB.child("groups");

function showFooterGroupsBtn(){
  convertTemplate("#footerBtn-tmpl", {}, "footer");
}

function showMemberGroupsPage(){

  listenToOwned_MemberGroups("member");
  showFooterGroupsBtn();
  setUrl();

}

function showPublicGroups(){

  listenToGeneralGroups("public");
  showFooterGroupsBtn();
  setUrl();

}

function showOwnedGroups(){

  listenToOwned_MemberGroups("owner");
  showFooterGroupsBtn();
  setUrl();
}

function stopListeningToPageDB (page){

}

function listenToGeneralGroups (typeOfGroup){
  //typeOfGroup: secret, public, close

  groupsDB.orderByChild("type").equalTo(typeOfGroup).once("value", function(groups){
    var groupsArray = new Array();
    var groupsDetails = new Object();

    groups.forEach(function(group){
      var newGroup = group.val();
      var preContext = {
        "uuid": group.key,
        "title": newGroup.title,
        "description": newGroup.description
      };

      groupsArray.push(preContext);
    });

    var context = {"groups": groupsArray}

    convertTemplate("#groupsGeneral-tmpl", context, "wrapper")

  })
}

function listenToOwned_MemberGroups (role){
  //role: owned, member

  if (role == "owner" || role == "member"){


    var userDB = DB.child("users/"+userUuid);



    //update groups details every time the user changes his groups
    userDB.child("role").orderByValue().equalTo(role).on("value", function(groupsUnderRole){

      if(groupsUnderRole.exists()){

        var groupsArray = new Array();

        //start counting the number of groups.
        var groupsUnderRoleLng = groupsUnderRole.val();
        console.dir(groupsUnderRoleLng);
        var numberOfGroups = Object.keys(groupsUnderRoleLng).length;

        var i = 1;
        groupsUnderRole.forEach(function(groupOwned){

          var isGroupOwned = groupOwned.val();
          var preContext = new Object();

          DB.child("groups/"+groupOwned.key).once("value", function(data){

            var title = data.val().title;
            var description = data.val().description;

            preContext = {
              uuid: groupOwned.key,
              title: title,
              description: description
            }

            groupsArray.push(preContext);

            if (i === numberOfGroups){

              var context = {groups: groupsArray};

              convertTemplate("#groups_"+role+"-tmpl", context, "wrapper");
            }
            i++;
          })
        })
      } else {
        console.log("groups don't exists");
        convertTemplate("#groups_"+role+"-tmpl", {}, "wrapper");
//        $("wrapper").html("");
      }
    })
  } else {console.log("type of role is not recognized")}
}

function showUserGroups(){

  var context = {"groups": groupsArray};

  convertTemplate("#groupsMember-tmpl", context,"wrapper" )

}

$("#btnAddGroup").click(function(){
  //showCreateGroupPopup();
  convertTemplate("#groupsOwned-tmpl",{},"#createGroupPopup");
  alert("creating");
});

function showCreateGroupPopup(){
  convertTemplate("#createGroupPopup-tmpl",{},"#createGroupPopup");
}


var userGroupsArray = new Array();
var memberContext = new Object();

//function getUserGroups(user){
//
//  var userDB = DB.child("users/"+user+"/groups/member");
//  userDB.on("value", function(groups){
//    userGroupsArray = [];
//    groups.forEach(function(group){
//      userGroupsArray.push(group.val());
//    })
//    console.log("1: "+userGroupsArray)
//
//    //create Member Context
//
//    var groupsArray = new Array();
//    var groupsDetails = new Object();
//
//    for (i in userGroupsArray){
//      groupsDB.child(userGroupsArray[i]).once("value", function(group){
//
//        if (group.exists()){
//          var newGroup = group.val();
//          var groupDetials = {
//            "uuid": group.key(),
//            "title": newGroup.title,
//            "description": newGroup.description
//          };
//          groupsArray.push(groupDetials);
//        }
//      })
//    }
//    memberContext = {"groups": groupsArray}
//    showMemberGroupsPage();
//    console.log("mc: " + JSON.stringify(memberContext));
//  })
//  console.log("2: "+userGroupsArray)
//
//}

