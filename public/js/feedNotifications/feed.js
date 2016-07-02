//------Feed List-------

function setFeed(){

    var userFeed = DB.child("users/"+userUuid+"/entityNotifications/"+activeEntity.entity+"/"+activeEntity.uid+"/feed");

    userFeed.once("value", function(dataSnapshot) {

        if (dataSnapshot.val() == true){
            userFeed.remove();
            $("#feedSubscribe").css("color", inactiveColor);

        } else {
            userFeed.set(true);
            $("#feedSubscribe").css("color", activeColor);

        }
    });
}

function showfeed(){


            var entity = entityNotifications.key;
            var curSubEntity = entityOwns[entity];

            //for each registerd notification set "on"
            jQuery.each(entityNotifications.val(), function(uid, active){
                //        console.log("entity: "+entity+", uid: "+ uid + ", active: "+ active);
                if(active){  //activate path

                    console.log("on path: "+ entity+"/"+uid+"/"+curSubEntity);
                    DB.child(entity+"/"+uid+"/"+curSubEntity).on("child_added", function(entityUpdate){

                        console.log("child added: "+ entityUpdate.key );

                    });
                } else {   //diactivate path
                    console.log("off path: "+ entity+"/"+uid+"/"+curSubEntity);
                    DB.child(entity+"/"+uid+"/"+curSubEntity).off();
                }
            })

}
