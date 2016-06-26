var optionsTempInput = new Array();

var numberOfOptionsTemp = 2;

function newQuestion(){

  for (i=1;i<9;i++){
    optionsTempInput["option"+i]={title:"", description:""};
  }

  convertTemplate("#createQuestion-tmpl",{}, "wrapper");
  convertTemplate("#createQuestionFooter-tmpl",{}, "footer")

  convertTemplate("#questionOptionsLimitedOptions-tmpl", {}, "#questionOptions");

  setNumberOfOptions(numberOfOptionsTemp);


  $('input[type=radio][name=type]').change(function(){

    var selcation = this.value;

    switch (selcation) {
      case "forAgainst":
        convertTemplate("#questionOptionsForAgainst-tmpl", {}, "#questionOptions");
        listenToOptionsInput();
        setForAgainst();
        break;
      case "twoOptions":
        listenToOptionsInput();
        setTwoOptions();
        break;
      case "limitedOptions":
        convertTemplate("#questionOptionsLimitedOptions-tmpl", {}, "#questionOptions");
        if(numberOfOptionsTemp>0){
          setNumberOfOptions(numberOfOptionsTemp);
        }
        break; 
      default:
        $("#questionOptions").html("");
    }
  })

};

function editQuestion(questionUid){

  //intiate temp options object
  for (i=1;i<9;i++){
    optionsTempInput["option"+i]={title:"", description:""};
  }


  //bring data from DB
  DB.child("questions/"+questionUid).once("value", function(dataSnapshot){

    numberOfOptionsTemp = dataSnapshot.val().numberOfOptions;
    console.log("Number of Options: "+ numberOfOptionsTemp);

    var title = dataSnapshot.val().title;
    var description = dataSnapshot.val().description;

    convertTemplate("#createQuestion-tmpl",{title: title, description:description}, "wrapper");
    convertTemplate("#createQuestionFooter-tmpl",{}, "footer")

    convertTemplate("#questionOptionsLimitedOptions-tmpl", {}, "#questionOptions");

//    setNumberOfOptions(numberOfOptionsTemp);

    $('input[type=radio][name=type]').change(function(){

      var selcation = this.value;

      switch (selcation) {
        case "forAgainst":
          convertTemplate("#questionOptionsForAgainst-tmpl", {}, "#questionOptions");
          break;
        case "limitedOptions":
          convertTemplate("#questionOptionsLimitedOptions-tmpl", {}, "#questionOptions");
          if(numberOfOptionsTemp>0){
            setNumberOfOptions(numberOfOptionsTemp);
          }
          break;
        default:
          $("#questionOptions").html("");
      }
    })

    //bring options from database

    DB.child("questions/"+questionUid+"/options").once("value", function(optionsSnapshot){
      var i=1;
      optionsSnapshot.forEach(function(optionData){
        optionsTempInput["option"+i]={title:optionData.val().title, description:optionData.val().description};
        console.log(JSON.stringify(optionsTempInput["option"+i]));
        i++;
      })
      setNumberOfOptions(numberOfOptionsTemp)
      console.dir(optionsTempInput);
    });
  });
}



function setTwoOptions(){

  var nameText1 = optionsTempInput["optionName1"];
  var nameText2 = optionsTempInput["optionName2"];
  var descriptionText1 = optionsTempInput["optionDescription1"];
  var descriptionText2 = optionsTempInput["optionDescription2"];

  convertTemplate("#questionOptionsTwoOptions-tmpl", {nameText1:nameText1, nameText2:nameText2, descriptionText1:descriptionText1, descriptionText2: descriptionText2 }, "#questionOptions");

  for( i=1; i< 3; i++){
    $("#optionName"+i).keyup(function(e){
      var dinput = this.value;

      optionsTempInput[e.currentTarget.id] = dinput;
      console.log(optionsTempInput);

    })
  }

  for( i=1; i< 3; i++){
    $("#optionDescription"+i).keyup(function(e){
      var dinput = this.value;
      optionsTempInput[e.currentTarget.id] = dinput;
      console.log(optionsTempInput);

    })
  }
}

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

  convertTemplate("#questionOption-tmpl", context, "#optionsForLimitedOptions");



  listenToOptionsInput(numberOfOptions);
}

function addNewQuestion(){
  //check if form exists...

  //get form info
  questionName = $("#createQuestionName").val();
  questionDescription = $("#createQuestionDescription").val();
  questionType = $("input[name=type]:checked").val();
  console.log("name: " + questionName + ", Question description: "+ questionDescription + ", type: " + questionType);

  if (questionName == "") {
    alert("חסר שם קבוצה");
    return;
  }

  if (userUuid == "" || userUuid == undefined) {
    alert("אנא התחבר/י למערכת");
    return;
  }
  var newQuestion = setNewQuestionToDB(questionName,questionDescription,questionType);
  //  var newQuestion = DB.child("questions").push({title: questionName, description: questionDescription, type: questionType, owner: userUuid });
  if (activeEntity.entity == "topics"){
    var topic = activeEntity.uid;
    DB.child("topics/"+topic+"/questions/"+newQuestion.key).set(true);
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
    }
  }

  var questionId = DB.child("questions").push({title: title, description: description, type: type, numberOfOptions: numberOfOptionsTemp, options:optionsTempInput});

  return questionId;
}

//function setQuestionToDB(){
//  console.log("seeting question")
//  for (i=1;i<9;i++){
//    //find name and description
//    var optionName = "optionName"+i;
//    var optionDescription = "optionDescription"+i;
//    var isName = optionsTempInput.indexOf(optionName);
//    console.log("isName: "+ isName);
//    var isDescription = optionsTempInput.indexOf(optionDescription);
//    console.log("isDescription: "+ isDescription)
//    if (isName >-1 || isDescription >-1){
//      if (isName >-1){
//        var dbName = optionsTempInput[optionName];
//      }
//      if (isDescription>-1){
//        var dbDescription = optionsTempInput[optionDescription];
//      }
//      console.log(i+") dbName: "+dbName + "dbDescription: "+dbDescription );
//    }
//  }
//
//}

function listenToOptionsInput(numberOfOptions){

  for( i=1; i< numberOfOptions+1; i++){
    $("#optionName"+i).keyup(function(e){
      var dinput = this.value;
      var id = e.currentTarget.id;
      var optionNumber = id.substr(-1);
      optionsTempInput["option"+optionNumber].title = dinput;
      console.log("input: "+ dinput);
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
