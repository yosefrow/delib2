
DB.on('child_changed', function (entityChanged) {

    // if users changed - get out.
    if(entityChanged.key == "users")
        return;

    // child changed get a snapshot of the child which children or its children-childrens changed. not the actual changed child
    console.log(entityChanged.val());
    console.log(entityChanged.key);


    // if other entity changed - move on
    DB.child("/users/" + userUuid + "/entityNotifications/" + entityChanged.key).once('value', function (snapshot) {
        snapshot.forEach(function (entityUpdated) {

            // check what updates

            var isGlobalReg    = entityUpdated.child('globalNotifications').exists();
            var isOwnerCallReg = entityUpdated.child('ownerCalls').exists();
            var isFeedReg      = entityUpdated.child('feed').exists();

            // check if sub-entity added, only if registered to Global or Feed. if not registered fo both - move on
            if (isGlobalReg || isFeedReg) {

                // check if sub-entity added.
                // if a sub-entity added to an entity (example: if a topic_uid added to group_uid under "topics"),
                DB.child(entityChanged.key + "/" + entityUpdated.key+ "/" + subEntity[entityChanged.key]).orderByChild('dateAdded').limitToLast(1).once('child_added', function (entityAddedUid) {

                    if(mostUpdatedUid == null)
                        mostUpdatedUid = entityAddedUid;
                    else if (mostUpdatedUid.val().dateAdded < entityAddedUid.val().dateAdded)
                        mostUpdatedUid = entityAddedUid;
                    else
                        return;

                    // if sub-entity added, go to sub entity's actual content.
                    DB.child(subEntity[entityChanged.key] + "/" + entityAddedUid.key).once('value', function (entityAddedContent) {

                        // if registered to Global
                        if (isGlobalReg == true) {
                            pushNotification(entityAddedContent, subEntity[entityChanged.key]);
                            return;
                        }

                        // if registered to feed then push feed chunk
                        if (isFeedReg == true)
                        {
                            feedPusher(entityAddedContent, subEntity[entityChanged.key]);
                        }
                    });
                }).catch(function (error) { console.log(error, "no entity path") });

                // do not proceed
                return;
            }

            if (isOwnerCallReg == true) {
                // if registered to ownerCalls then push an owner call notification
                DB.child(entityChanged.key + "/" + entityUpdated.key + "/ownerCalls").orderByChild('dateAdded').limitToLast(1).once('child_added', function (ownerCall) {

                    if(mostUpdatedUid == null)
                        mostUpdatedUid = ownerCall;
                    else if  (mostUpdatedUid.val().dateAdded < ownerCall.val().dateAdded) {
                        mostUpdatedUid = ownerCall;
                        pushNotification(ownerCall, "ownerCalls");
                    }

                }).catch(function (error) {
                    console.log(error, "no ownerCalls")
                });
            }
            });
        }).catch(function (error) { console.log(error, "no such entity registered") });
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
