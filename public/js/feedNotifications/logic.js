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

                        if(mostUpdatedContent == null)
                            mostUpdatedContent = ownerCall;
                        else if (mostUpdatedContent.val().dateAdded < ownerCall.val().dateAdded)
                            mostUpdatedContent = ownerCall;
                        else
                            return;

                        pushNotification(entityUpdate.key, "ownerCalls", ownerCall.val());
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
                //     // if(entityUpdates.key == "chats") {
                //     //     DB.child("chats/" + entityUpdate.key).on('child_added', function (chatUid) {
                //     //         DB.child("users/"+userUuid+"/entityNotifications/chats/"+entityUpdate.key).once('value', function (messagesSent) {
                //     //             DB.child(chatUid.val().entityType + "/" + entityUpdate.key).once('value', function (chatEntityContent) {
                //     //                 var messagesSentInc = messagesSent.child("/globalNotifications").val();
                //     //                 messagesSentInc++;
                //     //                 DB.child("users/"+userUuid+"/entityNotifications/chats/"+chatUid.key+"/globalNotifications").set(messagesSentInc);
                //     //                 console.log(chatUid.key, chatUid.val());
                //     //                 if (messagesSentInc > 5)
                //     //                     pushNotification(chatEntityContent,"chats",messagesSentInc);    
                //     //
                //     //             });
                //     //         });
                //     //
                //     //     });
                //     //
                //     // }
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


