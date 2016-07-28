function showLimitedOptionsQuestion(questionUid, numberOfOptions){

   var questionDB = DB.child("questions/"+questionUid+"/options");

   questionDB.off("value");
   questionDB.orderByChild("votes").limitToLast(numberOfOptions).once("value",function(options){

//      if(options.exists()){
//         setUrl("question", questionUid);
//      } else {
//         console.log("ERROR: no options exists");
//      }

      //adjust the votes to a counting of votes
      DB.child("questions/"+questionUid+"/simpleVoting").once("value", function(voters){
         var counts = new Object();
         voters.forEach(function(voter){
            if (!counts[voter.val()]){counts[voter.val()] = 0};
            counts[voter.val()]++;
            console.log(voter.val(),counts[voter.val()])
         });
         console.dir(counts);
         for (i in counts){
            questionDB.child(i).update({votes:counts[i]});
         }
      })

      var optionsObject = new Object();
      options.forEach(function(option){
         var color = option.val().color;
         if (color == undefined){
            var color = getRandomColor();
            DB.child("questions/"+questionUid+"/options/"+option.key).update({color:color});
         }

         optionsObject[option.key]= {uuid: option.key, title: option.val().title, votes: option.val().votes,color: color};
      })

      var preContext = new Array();

      for (i in optionsObject){
         preContext.push({questionUuid: questionUid ,uuid: optionsObject[i].uuid, title: optionsObject[i].title, votes: optionsObject[i].votes , color: optionsObject[i].color});
      }

      var context = {options: preContext};

      renderTemplate("#simpleVote-tmpl", context, "wrapper");
      renderTemplate("#simpleVoteBtns-tmpl", context, "footer");

      $(".voteBtn").ePulse({
         bgColor: "#ded9d9",
         size: 'medium'
      });

      renderLimitedOptions(optionsObject);

      listenToLimitedOptions(optionsObject, questionDB);
   })

   lightCheckedBtn(questionUid);
}

function voteSimple(questionUid, optionUid){

   $("#info").hide(400);
   var optionUidStr = JSON.stringify(optionUid);
   //check to see what have the user voted last

   DB.child("questions/"+questionUid+"/simpleVoting/"+userUuid).once("value", function(vote){
      var isExists = vote.exists();

      if (!isExists){
         DB.child("questions/"+questionUid+"/simpleVoting/"+userUuid).set(optionUid);

         DB.child("questions/"+questionUid+"/options/"+optionUid+"/votes").transaction(function(currentVote){
            return currentVote +1;
         })
         $(".voteBtn").css("border" , "0px solid black");
         $("#"+optionUid+"_btn").css("border" , "3px solid black");
      } else {
         var lastVoted = vote.val();
         if (optionUid == lastVoted){
            DB.child("questions/"+questionUid+"/options/"+optionUid+"/votes").transaction(function(currentVote){
               return currentVote -1;
            })
            DB.child("questions/"+questionUid+"/simpleVoting/"+userUuid).remove();

            $(".voteBtn").css("border" , "0px solid black");
         } else {
            DB.child("questions/"+questionUid+"/options/"+lastVoted+"/votes").transaction(function(currentVote){
               return currentVote -1;
            });
            DB.child("questions/"+questionUid+"/options/"+optionUid+"/votes").transaction(function(currentVote){
               return currentVote +1;
            })
            DB.child("questions/"+questionUid+"/simpleVoting/"+userUuid).set(optionUid);
            $(".voteBtn").css("border" , "0px solid black");
            $("#"+optionUid+"_btn").css("border" , "3px solid black");
         }

      }
   })
}

function lightCheckedBtn(questionUid){
   DB.child("questions/"+questionUid+"/simpleVoting/"+userUuid).once("value", function(checkedOption){

      $(".voteBtn").css("border" , "0px solid black");
      $("#"+checkedOption.val()+"_btn").css("border" , "3px solid black");
   })
}

function listenToLimitedOptions (optionsObject, questionDB){

   for (i in optionsObject){
      questionDB.child(optionsObject[i].uuid).on("value",function(optionVote){

         optionsObject[optionVote.key].votes = optionVote.val().votes;
         renderLimitedOptions(optionsObject);

      })
   }
}

function renderLimitedOptions(optionsObject){
   //look for max votes
   var maxVotes = 0;
   for (i in optionsObject){
      if (optionsObject[i].votes > maxVotes){
         maxVotes = optionsObject[i].votes;
      }
   }
   //find the dimensions of the wrapper to adjust drawing

   var NumberOfOptionsActualy = Object.keys(optionsObject).length;
   var divBarWidth = $("wrapper").width()/NumberOfOptionsActualy;
   var barWidth = 0.8*divBarWidth;

   var wrapperDimensions = new Object();
   var wrapperHeight = $("wrapper").height() - $("footer").height()-20;
   var minimumVotesToAdjust = 20;
   var x=1;

   if (maxVotes<=minimumVotesToAdjust){
      x= maxVotes/minimumVotesToAdjust
   }

   for (i in optionsObject){
      var relativeToMaxBar = (optionsObject[i].votes/maxVotes)*x;

      $("#"+optionsObject[i].uuid+"_div").css('height', wrapperHeight*relativeToMaxBar).css("width", barWidth).text(optionsObject[i].votes);
      $("#"+optionsObject[i].uuid+"_btn").css("background-color", optionsObject[i].color);
   }
}
