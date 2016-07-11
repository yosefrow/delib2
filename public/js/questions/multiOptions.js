function showMultiOptions(questionUid){

  DB.child("questions/"+questionUid+"/options").off("value");

  convertTemplate("#multiOptionsFooter-tmpl",{questionUid: questionUid}, "footer");

  //get options
  DB.child("questions/"+questionUid+"/options").orderByChild("votes").once("value",function(options){


    $("wrapper").html("");

    var optionsPosition = new Array();
    var optionsArray = new Array();

    options.forEach(function(option){
      var description = option.val().description;
      var title = option.val().title;
      var optionUid = option.key;
      var optionColor = option.val().color;
      var votes = option.val().votes;

      optionsPosition.push({uid: optionUid, votes: votes});

      DB.child("questions/"+questionUid+"/options/"+optionUid+"/thumbUp/"+userUuid).on("value", function(thumbUp){
        if (thumbUp.val()){
          $("#"+optionUid+"voteImg").attr("src", "img/thumbUpActive.png");
        } else {
          $("#"+optionUid+"voteImg").attr("src", "img/thumbUpInactive.png");
        }
      })

      prependTemplate("#multiOption-tmpl",{title:title, description: description, questionUid: questionUid, optionUid: optionUid, optionColor:optionColor }, "wrapper");
      $("#optionMenu"+optionUid).hide();

      //watch for changes in position
      DB.child("questions/"+questionUid+"/options/"+optionUid+"/votes").on("value",function(currentVote){
        $("#"+optionUid+"voteCount").text("בעד: "+currentVote.val());


        //get new votes and postion accordingly
        DB.child("questions/"+questionUid+"/options/").once("value", function(options){
          var previousOptionsArray = optionsArray;
          optionsArray = [];

          options.forEach(function(option){
            //set by order
            optionsArray.push([option.key,option.val().votes])
            console.log(JSON.stringify(optionsArray));

          })
          optionsArray.sort(function(a,b){return a[1]<b[1]});
          var currentOptionsArrayStr = JSON.stringify(optionsArray);
          var previousOptionsArrayStr = JSON.stringify(previousOptionsArray);

          if (currentOptionsArrayStr != previousOptionsArrayStr){
            console.log("they are not eqauls");
            for (i in optionsArray){
              var divHight = $("#"+optionsArray[i][0]+"Div").height();
              console.log("#"+optionsArray[i][0]+"Div: "+ divHight*i);
              $("#"+optionsArray[i][0]+"Div").animate({top: divHight*i})
            }
          } else {
            console.log("they are eqauls");
          }
        })

      });
    })
    //    $("wrapper").hide();
    //    $("wrapper").show(700);
  })


  //get update when votes change

  //get new options
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
