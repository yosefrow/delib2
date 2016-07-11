

function showMultiOptions(questionUid){

  var optionsPosition = new Array();
  var optionsArray = new Array();

  var optionsArrayOrder = new Array();

  DB.child("questions/"+questionUid+"/options").off("value");

  convertTemplate("#multiOptionsFooter-tmpl",{questionUid: questionUid}, "footer");



  //listen to vote change
  DB.child("questions/"+questionUid+"/options").orderByChild("votes").once("value", function(options){
    console.log("start options")




    $("wrapper").html("");

    options.forEach(function(option){
      var optionUid = option.key;
      var description = option.val().description;
      var title = option.val().title;
      var optionUid = option.key;
      var optionColor = option.val().color;
      var votes = option.val().votes;
      var userVote = option.val().thumbUp[userUuid];

      if (userVote) {
        userVote = "img/thumbUpActive.png";
      } else {
        userVote = "img/thumbUpInactive.png";
      }
      optionsPosition.push(optionUid);

      prependTemplate("#multiOption-tmpl",{title:title, description: description, questionUid: questionUid, optionUid: optionUid, optionColor:optionColor, votes:votes, userVote: userVote}, "wrapper");
      $("#optionMenu"+optionUid).hide();


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
          var tttt = new Array();

          for (i in newOrder){
            if(newOrder[i] == optionsPosition[i]){
              console.log("Options "+i+" are equal");
            } else {
              console.log("Options "+i+" are not equal", newOrder[i], optionsPosition[i]);
              isDifference = true;
              var oldPostionLocation = $("#"+optionsPosition[i]+"Div").position();
              console.log(oldPostionLocation.top);

              tttt[i] = oldPostionLocation.top;

//              $("#"+newOrder[i]+"Div").animate({top:oldPostionLocation.top},1000);
////              $("#"+newOrder[i]+"Div").animate({})
            }
          }
          if (isDifference){
            for (i in newOrder){
              $("#"+newOrder[i]+"Div").animate({top:tttt[i]},1000);
            }
          }
          optionsPosition = newOrder;
        })
      })
    })
    console.log(JSON.stringify(optionsPosition));
    //if change in user vote, change indecation


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
  console.log("hi")
  if (title == ""){
    alert("Title can't be empty");
    return;
  }

  createOption(questionUid, title, description);

  showMultiOptions(questionUid);
}
