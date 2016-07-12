

function showMultiOptions(questionUid){

  var optionsPosition = new Array();
  var optionsArray = new Array();

  var optionsArrayOrder = new Array();

  DB.child("questions/"+questionUid+"/options").off("value");

  convertTemplate("#multiOptionsFooter-tmpl",{questionUid: questionUid}, "footer");

  DB.child("questions/"+questionUid+"/options").on("child_added", function(options){
    console.log("child added:" + JSON.stringify(options.val()));
  })





  //listen to vote change
  DB.child("questions/"+questionUid+"/options").orderByChild("votes").once("value", function(options){
    console.log("start options")
    $("wrapper").html("");

    var indexDiv = 0;
    var numberOfDivs = options.numChildren();
    console.log("numberOfDivs: "+numberOfDivs)


    options.forEach(function(option){

      var optionUid = option.key;
      var description = option.val().description;
      var title = option.val().title;
      var optionColor = option.val().color;
      console.log("user id: "+userUuid, JSON.stringify(option.val().thumbUp));

      adjustCounting(questionUid,optionUid);

      var isSomebodyVoted = option.val().hasOwnProperty("thumbUp")
      if (isSomebodyVoted){
        var isUserVoted = option.val().thumbUp.hasOwnProperty(userUuid);
        console.log("isUserVoted: "+isUserVoted)
      } else {
        isUserVoted = false;
      }
      if (!isUserVoted){
        DB.child("questions/"+questionUid+"/options/"+optionUid+"/thumbUp/"+userUuid).set(false)
        var userVote = false;
        console.log("user dosn't in DB")
      } else {
        var userVote = option.val().thumbUp[userUuid];
        console.log("user voted: "+ userVote);
      }


      var votes = option.val().votes;
      if (votes == undefined){ votes = 0};

      if (userVote) {
        userVote = "img/thumbUpActive.png";
      } else {
        userVote = "img/thumbUpInactive.png";
      }
      optionsPosition.push(optionUid);

      prependTemplate("#multiOption-tmpl",{title:title, description: description, questionUid: questionUid, optionUid: optionUid, optionColor:optionColor, votes:votes, userVote: userVote}, "wrapper");
      $("#optionMenu"+optionUid).hide();

      $("#"+optionUid+"Div").offset({top: ((numberOfDivs-indexDiv)*87)-30, right:5})
      indexDiv++;


      DB.child("questions/"+questionUid+"/options/"+optionUid+"/thumbUp/"+userUuid).on("value",function(isThumbUp){
        if(isThumbUp.val()){
          $("#"+optionUid+"voteImg").attr("src", "img/thumbUpActive.png");
        } else {
          $("#"+optionUid+"voteImg").attr("src", "img/thumbUpInactive.png");
        }
      })

      //if changes in votes change in text
      DB.child("questions/"+questionUid+"/options/"+optionUid+"/votes").on("value",function(currentVote){
        $("#"+optionUid+"voteCount").text("בעד: "+ currentVote.val());

        //see if changes in locations
        //get new order
        DB.child("questions/"+questionUid+"/options").orderByChild("votes").once("value", function(options){
          var newOrder = new Array();
          options.forEach(function(option){
            newOrder.push(option.key);
          })

          var isDifference = false;
          var newOrderLength = newOrder.length;

          for (i in newOrder){
            if(newOrder[i] == optionsPosition[i]){

            } else {
              isDifference = true;
              var oldPostionLocation = $("#"+optionsPosition[i]+"Div").position();
              ////              $("#"+newOrder[i]+"Div").animate({})
            }
          }
          if (isDifference){
            var numberOfNewDivs = newOrder.length;
            for (i in newOrder){
              $("#"+newOrder[i]+"Div").animate({top:((numberOfNewDivs-i)*87)-70},1500, "easeOutElastic");
            }
          }
          optionsPosition = newOrder;
        })
      })
    })
  })
}

function voteUpOption(questionUid, optionUid){
  DB.child("questions/"+questionUid+"/options/"+optionUid+"/thumbUp/"+userUuid).once("value", function(thumbUp){
    if (thumbUp.val()){
      DB.child("questions/"+questionUid+"/options/"+optionUid+"/thumbUp/"+userUuid).set(false);
      DB.child("questions/"+questionUid+"/options/"+optionUid+"/votes").transaction(function(currentVote){
        return currentVote -1;
      });
      $("#"+optionUid+"voteImg").attr("src", "img/thumbUpInactive.png");
    } else {
      DB.child("questions/"+questionUid+"/options/"+optionUid+"/thumbUp/"+userUuid).set(true);
      DB.child("questions/"+questionUid+"/options/"+optionUid+"/votes").transaction(function(currentVote){
        return currentVote +1;
      });
      $("#"+optionUid+"voteImg").attr("src", "img/thumbUpActive.png");
    }
  })
}
function orderAcccordingToVotes(questionUid){
  DB.child("questions/"+questionUid+"/options/").once("value",function(options){

  })
}

function addMultiOption(questionUid){
  convertTemplate("#createMultiOption-tmpl",{}, "wrapper");
  convertTemplate("#createMultiOptionFooter-tmpl", {questionUid:questionUid}, "footer")
}

function addMultiOptionToDB(questionUid){
  var title = $("#createMultiOptionName").val();
  var description = $("#createMultiOptionDescription").val();

  if (title == ""){
    alert("Title can't be empty");
    return;
  }

  createOption(questionUid, title, description);

  showMultiOptions(questionUid);
}

function adjustCounting(questionUid, optionUid){
  DB.child("questions/"+questionUid+"/options/"+optionUid+"/thumbUp").once("value", function(thumbsUp){
    //get numbe of true
    var count = 0
    thumbsUp.forEach(function(thumbUp){
      if(thumbUp.val()){ count++}

    })
    console.log("option "+ optionUid+" count: "+count)
    DB.child("questions/"+questionUid+"/options/"+optionUid+"/votes").set(count);
  })
}
