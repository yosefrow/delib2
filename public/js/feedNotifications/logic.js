
DB.child("/users/"+userUuid+"/entityNotifications").on('value', function (notificationsEntities) {
    console.log("0");
    notificationsEntities.forEach(function (notificationsEntity) {
        console.log("1");
        notificationsEntity.forEach(function (notificationsEntityDatum) {
            console.log("12");

            if (notificationsEntityDatum.key.child('ownerCalls').val() == true)
                DB.child(notificationsEntity.key + "/" + notificationsEntityDatum.key + "/ownerCalls").once('child_added', function (entityDatum) {
                    console.log("12.a");
                        pushNotification(entityDatum, "ownerCalls");
                }).catch(function (error) {
                    console.log(error, "no ownerCalls");
                });


            DB.child(notificationsEntity.key + "/" + notificationsEntityDatum.key + "/" + subEntity[notificationsEntity.key]).once('child_added', function (entityDatum) {
                console.log("12.b");
                pushNotification(entityDatum, subEntity[notificationsEntity.key]);

                if (notificationsEntityDatum.key.child('feed').val() == true)
                    feedPusher(entityDatum, subEntity[notificationsEntity.key]);

            }).catch(function (error) {
                console.log(error, "no entity path");
            });

        });
    });
});

function feedPusher (entityDatum, subEntityType) {

    var feedJson = {};
    var chatMessagesCounter;
    const FEEDVolume = 20;

    if (Object.keys(feedJson).length >= FEEDVolume)
        switch (subEntityType) {
            case "chats":
                feedJson[entityDatum] = {
                    roomName: entityDatum.val().title,
                    chatMessagesCounter: feedJson[entityDatum].chatMessagesCounter > 0 ? feedJson[entityDatum].chatMessagesCounter++ : 1,
                    date: entityDatum.val().dateAdded
            };
                break;

            default:
                feedJson[entityDatum] = {
                    title: entityDatum.val().title,
                    description: entityDatum.val().description,
                    date: entityDatum.val().dateAdded
                };
                break;

        }


}
