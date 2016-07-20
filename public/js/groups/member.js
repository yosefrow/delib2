function membership(){
  groupUid = activeEntity.uid;

  DB.child("users/"+userUuid+"/membership/"+groupUid).once("value", function(isMembership){
    if(isMembership.val() != null){
      console.log("Membership exists");
      if (isMembership.val()){
        DB.child("users/"+userUuid+"/membership/"+groupUid).remove();
        DB.child("users/"+userUuid+"/entityNotifications/groups/"+groupUid+"/ownerCalls").remove();
        $("#isMembership").css("color",inactiveColor);
      } else {
        DB.child("users/"+userUuid+"/membership/"+groupUid).set(true);
        DB.child("users/"+userUuid+"/entityNotifications/groups/"+groupUid+"/ownerCalls").set(true);
        $("#isMembership").css("color",activeColor);
      }
    } else {
      DB.child("users/"+userUuid+"/membership/"+groupUid).set(true);
      $("#isMembership").css("color",activeColor);
    }
  })
}

function isMembership(){
  groupUid = activeEntity.uid;

  console.log("is membership: "+ groupUid);

  DB.child("users/"+userUuid+"/membership/"+groupUid).once("value", function(isMembership){
    if(isMembership.val() != null){
      console.log("Membership exists");
      if (isMembership.val()){
        console.log("is a member");
        $("#isMembership").css("color",activeColor);
      } else {
        console.log("not a member");
        $("#isMembership").css("color",inactiveColor);
      }
    } else {
      console.log("Membership dosn't exists");
      $("#isMembership").css("color",inactiveColor);
    }
  })
}
