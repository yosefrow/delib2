//create new question
function createNewQuestion(title, description, explanation, imgQuestion){

  if (title == undefined){
    title = "";
    console.log("Error: new topic do not have title");
  };

  if (description == undefined){
    description = "";
  };
  if (explanation == undefined){
    explanation = "";
  };
  if (imgQuestion == undefined){
    imgQuestion = "";
  };

  DB.child("questions").push({title: title, description: description, explanation: explanation, imgQuestion: imgQuestion});
}

//show header and question


//show question

//type of question

function showQuestion(questionUid){
  //get question info
  DB.child("questions/"+questionUid).once("value",function(dataSnapshot){
    var title = dataSnapshot.val().title;
    convertTemplate("#questionHeaderTitle-tmpl", {question: title}, "#headerTitle")
    var description = dataSnapshot.val().description;
    var typeOfQuestion = dataSnapshot.val().typeOfQuestion;
    var numberOfOptions = dataSnapshot.val().numberOfOptions;

    switch (typeOfQuestion){
      case "simpleVote":
        showQuestionSimpeVote(questionUid, numberOfOptions);
        break;

      default:
        showQuestionSimpeVote(questionUid, numberOfOptions);
    }
  });
}

function showQuestionSimpeVote(questionUid, numberOfOptions){
  DB.child("questions/"+questionUid+"/options").orderByChild("order").limitToLast(numberOfOptions).on("value",function(options){

    var maxVotes = 0;

    var optionsArray = new Array();
    options.forEach(function(option){
      var color = option.val().color;
      if (color == undefined){
        var color = getRandomColor();
        DB.child("questions/"+questionUid+"/options/"+option.key).update({color:color});
      }

      console.log("option "+ option.key+": " + option.val().title + " has " + option.val().votes + " votes");
      optionsArray.push({uuid: option.key, title: option.val().title, votes: option.val().votes,color: color});


      if (maxVotes<option.val().votes){
        maxVotes = option.val().votes;
      }
    })

    var preContext = new Array();

//    optionsArray.reverse();
    for (i in optionsArray){
      console.log(optionsArray[i].title+", "+ optionsArray[i].votes);
      preContext.push({uuid: optionsArray[i].uuid, option: optionsArray[i].title, votes: optionsArray[i].votes , color: optionsArray[i].color});
    }
    var context = {options: preContext};
    convertTemplate("#simpleVote-tmpl", context, "wrapper");

    var NumberOfOptionsActualy = optionsArray.length;
    console.log("n of opt: "+ NumberOfOptionsActualy);
    var divBarWidth = $("wrapper").width()/NumberOfOptionsActualy;
    var barWidth = 0.8*divBarWidth;
    console.log("barWidth: "+barWidth)

    var wrapperHeight = $("wrapper").height() - $("footer").height()-20;

    var minimumVotesToAdjust = 20;
    var x=1;

    if (maxVotes<=minimumVotesToAdjust){
      x= maxVotes/minimumVotesToAdjust
    }

    for (i in optionsArray){
      var relativeToMaxBar = (optionsArray[i].votes/maxVotes)*x;

      $("#"+optionsArray[i].uuid+"_div").css('height', wrapperHeight*relativeToMaxBar).css("background-color", optionsArray[i].color).css("width", barWidth) ;
    }
  })


}
