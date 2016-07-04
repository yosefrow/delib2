
 DB.child("/users/"+userUuid+"/entityNotifications").on('value', function (entitiesUpdates) {
     console.log("lakalakalalla");
     // search inside entities
         entitiesUpdates.forEach(function (entityUpdates) {
             // search inside entity
                 entityUpdates.forEach(function (entityUpdate) {
                     console.log(entityUpdate.key, entityUpdates.key);

                     var isGlobalReg    = entityUpdate.child('globalNotifications').exists();
                     var isOwnerCallReg = entityUpdate.child('ownerCalls').exists();
                     var isFeedReg      = entityUpdate.child('feed').exists();

                     // if subscribed to ownerCalls
                     if (isOwnerCallReg) {
                         DB.child(entityUpdates.key + "/" + entityUpdate.key + "/ownerCalls").limitToLast(1).on('child_added', function (ownerCall) {
                             pushNotification(ownerCall, "ownerCalls");
                         }).catch(function (error) { console.log(error, "no ownerCalls") });

                         return;
                     }

                     // check if sub-entity added, only if registered to Global or Feed. if not registered fo both - move on

                    if (isGlobalReg || isFeedReg) {
                        DB.child(entityUpdates.key + "/" + entityUpdate.key + "/" + subEntity[entityUpdates.key]).limitToLast(1).on('child_added', function (entityAddedUid) {

                            if (isGlobalReg)
                                pushNotification(entityAddedUid, subEntity[entityUpdates.key]);

                            if (isFeedReg)
                                feedPusher(entityAddedUid, subEntity[entityUpdates.key]);

                       }).catch(function (error) { console.log(error, "no entity path") });
                    }
                 });
         });
 });


function feedPusher (entityDatum, subEntityType) {

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
