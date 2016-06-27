//Feed Logic


// Notifications Logic


DB.child("groups").on('child_changed', function(EntityData) {
    DB.child("users/" + userUuid + "/entityNotifications/groups").once("value" ,function (data) {
        data.forEach(function (childSnapshot) {
            if (childSnapshot.key == EntityData.key)
                console.dir(EntityData.key);
            pushNotification(EntityData, "groups");
        });
    });
});

DB.child("topics").on('child_changed', function(EntityData) {
    DB.child("users/" + userUuid + "/entityNotifications/topics").once("value" ,function (data) {
        data.forEach(function (childSnapshot) {
            if (childSnapshot.key == EntityData.key)
                console.dir(EntityData.key);
            pushNotification(EntityData, "topics");
        });
    });
});

DB.child("questions").on('child_changed', function(EntityData) {
    DB.child("users/" + userUuid + "/entityNotifications/questions").once("value" ,function (data) {
        data.forEach(function (childSnapshot) {
            if (childSnapshot.key == EntityData.key)
                console.dir(EntityData.key);
            pushNotification(EntityData, "questions");
        });
    });
});
