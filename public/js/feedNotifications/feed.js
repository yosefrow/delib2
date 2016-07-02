//------Feed List-------

function setFeed(){

    var userNotificationsDB = DB.child("users/"+userUuid+"/localNotifications/"+activeEntity.entity+"/"+activeEntity.uid);

    userNotificationsDB.once("value", function(dataSnapshot){
        if (dataSnapshot.val() == true){
            userNotificationsDB.remove();
            $("#feedSubscribe").css("color", inactiveColor);
        } else {
            userNotificationsDB.set(true);
            $("#feedSubscribe").css("color", activeColor);
        }
    })
}



const subEntitys = {groups: "topics", topics: "questions", questions: "", chats: ""};

function showfeed(){

    //get active notifications
    DB.child("users/"+userUuid+"/localNotifications").on("value", function(notifications){
        notifications.forEach(function(entityNotifications){

            var entity = entityNotifications.key;
            var curSubEntity = subEntitys[entity];

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
        })

    })
}
