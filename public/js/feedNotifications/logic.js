function updatesListener() {
    // turn off previous listener
    DB.child("users/"+userUuid+"/entityNotifications").off();

    // listene to Updates
    DB.child("users/"+userUuid+"/entityNotifications").on('value', function (entitiesUpdates) {
        // search inside entities
        entitiesUpdates.forEach(function (entityUpdates) {
            // search inside entity
            entityUpdates.forEach(function (entityUpdate) {

                // var isGlobalReg    = entityUpdate.child('newSubEntity').exists();
                var isOwnerCallReg = entityUpdate.child('ownerCalls').exists();
                // var isFeedReg      = entityUpdate.child('feed').exists();

                // if subscribed to ownerCalls
                // if (isOwnerCallReg) {
                //     DB.child(entityUpdates.key + "/" + entityUpdate.key + "/ownerCalls").orderByChild('dateAdded').limitToLast(1).on('child_added', function (ownerCall) {
                //         console.log("1");
                //         if(mostUpdatedContent == null)
                //             mostUpdatedContent = ownerCall;
                //             //needs to be mostUpdatedContent.key as chats
                //         else if (mostUpdatedContent.dateAdded < ownerCall.dateAdded)
                //             mostUpdatedContent = ownerCall;
                //         else
                //             return;
                //         DB.child(entityUpdates.key + "/" + entityUpdate.key).once('value', function (actualContent) {
                //             pushNotification(actualContent, "ownerCalls", ownerCall.val().description)
                //         });
                //     }); //.catch(function (error) { console.log(error, "no ownerCalls") })
                // }

                // check if sub-entity added, only if registered to Global or Feed. if not registered fo both - move on

                // if (isGlobalReg || isFeedReg) {
                //     DB.child(entityUpdates.key + "/" + entityUpdate.key + "/" + subEntity[entityUpdates.key]).orderByChild('dateAdded').limitToLast(1).on('child_added', function (entityAddedUid) {
                //         DB.child(subEntity[entityUpdates.key] + "/" + entityAddedUid.key).once('value', function (actualContent) {
                //
                //
                //             console.log(mostUpdatedContent.val());
                //             console.log(actualContent.val());
                //             console.log(Number(mostUpdatedContent.val().dateAdded) < Number(entityAddedUid.val().dateAdded));
                //
                //
                //             if (mostUpdatedContent == null)
                //                 mostUpdatedContent = actualContent;
                //             else if (mostUpdatedContent.val().dateAdded < entityAddedUid.val().dateAdded)
                //                 mostUpdatedContent = actualContent;
                //             else
                //                 return;
                //
                //             if (isGlobalReg)
                //                 pushNotification(actualContent, subEntity[entityUpdates.key]);
                //
                //             if (isFeedReg) {
                //                 feedBuilder(actualContent, subEntity[entityUpdates.key]);
                //                 console.log(feedQueue);
                //             }
                //
                //         }); //.catch(function (error) { console.log(error, "no entity path") })
                //     });
                //
                //     // chat logic
                    if(entityUpdates.key == "chats") {
                        console.log("1");
                        DB.child("chats/" + entityUpdate.key+ "/messages").limitToLast(1).orderByChild('time').on('child_added', function (chatUid) {
                            //dont send notifications if inside the chat, and only for groups && activeEntity.entityType !== "chats" && activeEntity.entity !== chatUid.key
                            DB.child("chats/" + entityUpdate.key).once('value', function (chatUidContent) {
                                if(chatUidContent.val().entityType == "groups" ) {
                                    console.log("1");
                                    DB.child("users/"+userUuid+"/entityNotifications/chats/"+entityUpdate.key+"/inboxMessages").once('value', function (inboxVolume) {
                                        console.log("1");
                                        DB.child("/"+chatUidContent.val().entityType+"/"+chatUidContent.key).once('value', function (chatEntityContent) {
                                            // console.log(chatUidContent.entityType, chatUidContent.key);

                                            if(mostUpdatedContent == null)
                                                mostUpdatedContent = chatUid;
                                            else if (mostUpdatedContent.val().time < chatUid.val().time)
                                                mostUpdatedContent = chatUid;
                                            else
                                                return;

                                            var messagesSentInc;
                                                // get inbox volume
                                                messagesSentInc = inboxVolume.val();
                                                // increment inbox volume
                                                messagesSentInc++;
                                                //set incremented inbox volume

                                                DB.child("users/" + userUuid + "/entityNotifications/chats/" + chatUidContent.key + "/inboxMessages").set(messagesSentInc);

                                                console.log(chatUid.key, chatUid.val());
                                                // send notifications in jumps of 5
                                                // if (inboxVolume.val()%5 == 0)
                                                    pushNotification(chatEntityContent, "chats", messagesSentInc);
                                        });
                                    });
                                }
                            });
                        });
                    }
                // }
            });
        });
    });
}


// feed builder
// function feedBuilder (entityDatum, subEntityType) {
//
//     switch (subEntityType) {
//         case "chats":
//             //     feedJson[entityDatum] = {
//             //         roomName: entityDatum.val().title,
//             //         chatMessagesCounter: feedJson[entityDatum].chatMessagesCounter > 0 ? feedJson[entityDatum].chatMessagesCounter++ : 1,
//             //         date: entityDatum.val().dateAdded
//             // };
//
//             break;
//
//         default:
//             feedQueue.push({
//                 title: entityDatum.val().title,
//                 description: entityDatum.val().description,
//                 date: entityDatum.val().dateAdded
//             });
//
//             // if feedVolume got to 20, also remove last feed in feedQueue
//             if(Object.keys(feedQueue).length >= feedVolume)
//                 feedQueue.pop();
//
//             break;
//     }
// }


