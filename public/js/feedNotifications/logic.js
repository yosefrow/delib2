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
                if (isOwnerCallReg) {
                    DB.child(entityUpdates.key + "/" + entityUpdate.key + "/ownerCalls").orderByChild('dateAdded').limitToLast(1).on('child_added', function (ownerCall) {
                        console.log("1");
                        if(mostUpdatedContent == null)
                            mostUpdatedContent = ownerCall;
                            //needs to be mostUpdatedContent.key as chats
                        else if (mostUpdatedContent.dateAdded < ownerCall.dateAdded)
                            mostUpdatedContent = ownerCall;
                        else
                            return;
                        DB.child(entityUpdates.key + "/" + entityUpdate.key).once('value', function (actualContent) {
                            pushNotification(actualContent, "ownerCalls", ownerCall.val().description)
                        });
                    }); //.catch(function (error) { console.log(error, "no ownerCalls") })
                }

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
                        // check if added message, get last message by date
                        DB.child("chats/" + entityUpdate.key+ "/messages").limitToLast(1).orderByChild('dateAdded').on('child_added', function (lastMessage) {
                            // we need the actual content of chatRoom in order to get chatRoomContent.val().entityType
                            DB.child("chats/" + entityUpdate.key).once('value', function (chatRoomContent) {

                                // REUSE when done: && activeEntity.entityType !== "chats" && activeEntity.entity !== chatUid.key
                                // dont send notifications if inside the chat, and only send for groups
                                if(chatRoomContent.val().entityType == "groups" ) {
                                    // now we need the inboxVolume to get the number of messages not seen
                                    DB.child("users/"+userUuid+"/entityNotifications/chats/"+entityUpdate.key+"/inboxMessages").once('value', function (inboxVolume) {
                                        // now we need the actual content of the entity related to current chatRoom
                                        DB.child("/"+chatRoomContent.val().entityType+"/"+chatRoomContent.key).once('value', function (chatEntityContent) {

                                            // in order to prevent recursive feedback in line 6 we have to make sure inboxMessages is incremented per one
                                            // and only one message, we'll do this by getting the uid of the latest Update. in future we might want to consider a function
                                            // updating mostUpdatedContent global variable, and a .key comperison of mostUpdatedContent, different key 
                                            // may confirm a new update.
                                            
                                            if(mostUpdatedContent == null)
                                                mostUpdatedContent = lastMessage;
                                            else if (mostUpdatedContent.val().dateAdded < lastMessage.val().dateAdded)
                                                mostUpdatedContent = lastMessage;
                                            else
                                                return;
 
                                            // create a temporary messagesSentInc to hold inboxVolume.val()
                                            var messagesSentInc;
                                            
                                            // get inboxVolume.val()
                                            messagesSentInc = inboxVolume.val();
                                            
                                            // increment inbox volume
                                            messagesSentInc++;
                                            
                                            //set incremented inbox volume
                                            DB.child("users/" + userUuid + "/entityNotifications/chats/" + chatRoomContent.key + "/inboxMessages").set(messagesSentInc);

                                            // send notifications in jumps of 5, might want to consider further manipulations. currently unused.
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


