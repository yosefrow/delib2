var optionsTempInput = new Array();

var numberOfOptionsTemp = 2;

function newQuestion(){

  for (i=1;i<9;i++){
    optionsTempInput["option"+i]={title:"", description:""};
  }

  renderTemplate("#createQuestion-tmpl",{}, "wrapper");
  renderTemplate("#createQuestionFooter-tmpl",{}, "footer");

  renderTemplate("#questionOptionsLimitedOptions-tmpl", {}, "#questionOptions");

  setNumberOfOptions(numberOfOptionsTemp);


  $('input[type=radio][name=type]').change(function(){

    var selcation = this.value;

    switch (selcation) {
      case "forAgainst":
        renderTemplate("#questionOptionsForAgainst-tmpl", {}, "#questionOptions");
        listenToOptionsInput();
        setForAgainst();
        break;
//      case "twoOptions":
//        listenToOptionsInput();
//        setTwoOptions();
//        break;
      case "limitedOptions":
        renderTemplate("#questionOptionsLimitedOptions-tmpl", {}, "#questionOptions");
        if(numberOfOptionsTemp>0){
          setNumberOfOptions(numberOfOptionsTemp);
        }
        break;
      default:
        $("#questionOptions").html("");
    }
  })

};


function setNumberOfOptions(numberOfOptions){

  numberOfOptionsTemp = numberOfOptions;

  //color the menu
  for (i=2; i<9;i++){
    $("#numberOfOptions"+i).css("background", "linear-gradient(to bottom,  #cc0000 0%,#cc3535 52%,#6d0000 100%)");
  }
  $("#numberOfOptions"+numberOfOptions).css("background", "linear-gradient(to top,  #cc0000 0%,#cc3535 52%,#6d0000 100%)");
  console.dir(optionsTempInput)
  var preContext = new Array();
  for (i=1; i < numberOfOptions+1 ;i++){
    var nameText = optionsTempInput["option"+i].title;
    var descriptionText = optionsTempInput["option"+i].description;

    preContext.push({optionNumber: i, nameText:nameText, descriptionText: descriptionText});
  }

  var context = {option: preContext};

  renderTemplate("#questionOption-tmpl", context, "#optionsForLimitedOptions");



  listenToOptionsInput(numberOfOptions);
}

function addNewQuestion(){
  //check if form exists...

  //get form info
  var questionName = $("#createQuestionName").val();
  var questionDescription = $("#createQuestionDescription").val();
  var questionType = $("input[name=type]:checked").val();

  if (questionName == "") {
    alert("חסר שם שאלה");
    return;
  }

  if (userUuid == "" || userUuid == undefined) {
    alert("אנא התחבר/י למערכת");
    return;
  }
  for (i=1;i<=numberOfOptionsTemp;i++){
    if (optionsTempInput["option"+i].title == "") {
      alert(" אופציה מספר "+i+" ריקה");
      return;
    }
  }
  var newQuestion = setNewQuestionToDB(questionName,questionDescription,questionType);
  //  var newQuestion = DB.child("questions").push({title: questionName, description: questionDescription, type: questionType, owner: userUuid });
  if (activeEntity.entity == "topics") {
    var topic = activeEntity.uid;
    DB.child("topics/"+topic+"/questions/"+newQuestion.key+"/dateAdded").set(firebase.database.ServerValue.TIMESTAMP);
  }
  DB.child("users/"+userUuid+"/questions/"+newQuestion.key).set("owner");

  showTopic(activeEntity.uid);
}


//create new question
function setNewQuestionToDB (title, description, type){

  if (title == undefined){
    title = "";
    console.log("Error: new topic do not have title");
  };

  if (description == undefined){
    description = "";
  };
  if (type == undefined){
    explanation = "";
  };
  //  if (imgQuestion == undefined){
  //    imgQuestion = "";
  //  };
  for (i=1;i<9;i++){
    if (optionsTempInput["option"+i].title == ""){
      delete optionsTempInput["option"+i];
    } else {
      if (optionsTempInput["option"+i].color == null){
        optionsTempInput["option"+i].color = getRandomColor();
      }
    }
  }



  var questionId = DB.child("questions").push({dateAdded: firebase.database.ServerValue.TIMESTAMP, title: title, description: description, type: type, numberOfOptions: numberOfOptionsTemp, options:optionsTempInput, owner: userUuid});

  return questionId;
}

function listenToOptionsInput(numberOfOptions){

  for( i=1; i< numberOfOptions+1; i++){
    $("#optionName"+i).keyup(function(e){
      var dinput = this.value;
      var id = e.currentTarget.id;
      var optionNumber = id.substr(-1);
      optionsTempInput["option"+optionNumber].title = dinput;
    })
  }

  for( i=1; i< numberOfOptions+1; i++){
    $("#optionDescription"+i).keyup(function(e){
      var dinput = this.value;
      var id = e.currentTarget.id;
      var optionNumber = id.substr(-1);
      optionsTempInput["option"+optionNumber].description = dinput;
      console.log("input: "+ dinput);
    })
  }
}
