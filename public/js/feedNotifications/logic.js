//Feed Logic


// Notifications Logic

//child added

DB.child("groups").on('child_chagned', function(EntityData) {
    DB.child("users/" + userUuid + "/entityNotifications/groups").once('value' ,function (data) {
        data.forEach(function (childSnapshot) {
            if (childSnapshot.key == EntityData.key) {
                DB.child("groups/" + childSnapshot.key + "/topics").on('child_added', function (addedTopic) {
                    console.dir(addedTopic.key);
                    pushNotification(addedTopic, "topics");
                });
            }
        });
    });
});

DB.child("topics").on('child_chagned', function(EntityData) {
    DB.child("users/" + userUuid + "/entityNotifications/topics").once('value' ,function (data) {
        data.forEach(function (childSnapshot) {
            if (childSnapshot.key == EntityData.key) {
                DB.child("groups/" + childSnapshot.key + "/questions").on('child_added', function (addedTopic) {
                    console.dir(addedTopic.key);
                    pushNotification(addedTopic, "questions");
                });
            }
        });
    });
});




// Entity's Owner Call
///ownerNotifications
    DB.ref("/users/"+userUuid+"/entityNotifications").on('value', function (data) {

        DB.child("groups").on('value', function (EntityData) {
                .on('child_added',function () {
                data.forEach(function (childAddedSnapshot) {
                    if (childAddedSnapshot.key == ownerNotification.key){
                        console.dir(EntityData.key);
                        pushNotification(EntityData, "topics");
                    }
                });
            });
        });

        DB.child("questions").on('child_added', function(EntityData) {
            data.forEach(function (childAddedSnapshot) {
                if (childAddedSnapshot.key == EntityData.key){
                    console.dir(EntityData.key);
                    pushNotification(EntityData, "options");
                }
            });
        });// checked!

        DB.child("topics").on('child_chagned', function(EntityData) {
            data.forEach(function (childAddedSnapshot) {
                if (childSnapshot.key == EntityData.key) {
                    DB.child("groups/" + childAddedSnapshot.key + "/questions").on('child_added', function (addedTopic) {
                        console.dir(addedTopic.key);
                        pushNotification(addedTopic, "questions");
                    });
                }
            });
        });

    });

//topic Notifications- for a later use
//
// DB.child("questions").on('child_added', function(EntityData) {
//     DB.child("users/" + userUuid + "/entityNotifications/questions").once("value" ,function (data) {
//         data.forEach(function (childSnapshot) {
//             if (childSnapshot.key == EntityData.key)
//                 console.dir(EntityData.key);
//             pushNotification(EntityData, "questions");
//         });
//     });
// });