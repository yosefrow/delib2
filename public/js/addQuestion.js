var optionsTempInput = new Array();
var numberOfOptionsTemp = 0;


function showAddQuestionScreen(){
  convertTemplate("#createQuestion-tmpl",{}, "wrapper");
  convertTemplate("#createQuestionFooter-tmpl",{}, "footer")

  $('input[type=radio][name=type]').change(function(){

    var selcation = this.value;
    
    switch (selcation) {
      case "forAgainst":
        convertTemplate("#questionOptionsForAgainst-tmpl", {}, "#questionOptions");
        break;
      case "twoOptions":        
        setTowOptions();
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
  
  optionsTempInput = [];
}



function setTowOptions(){
  
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
  
  for (i=2; i<9;i++){
    $("#numberOfOptions"+i).css("background", "linear-gradient(to bottom,  #cc0000 0%,#cc3535 52%,#6d0000 100%)");
  }
  $("#numberOfOptions"+numberOfOptions).css("background", "linear-gradient(to top,  #cc0000 0%,#cc3535 52%,#6d0000 100%)");

  var preContext = new Array();
  for (i=1; i < numberOfOptions+1 ;i++){
    var nameText = optionsTempInput["optionName"+i];
    var descriptionText = optionsTempInput["optionDescription"+i];
    
    preContext.push({optionNumber: i, nameText:nameText, descriptionText: descriptionText});
  }

  var context = {option: preContext};
  
  convertTemplate("#questionOption-tmpl", context, "#optionsForLimitedOptions");



  for( i=1; i< numberOfOptions+1; i++){
    $("#optionName"+i).keyup(function(e){
      var dinput = this.value;
      
      optionsTempInput[e.currentTarget.id] = dinput;
      console.log(optionsTempInput);

    })
  }

  for( i=1; i< numberOfOptions+1; i++){
    $("#optionDescription"+i).keyup(function(e){
      var dinput = this.value;
      optionsTempInput[e.currentTarget.id] = dinput;      
    })
  }
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

  var newQuestion = DB.child("questions").push({title: questionName, description: questionDescription, type: questionType, owner: userUuid });
  if (activeEntity.entity == "topics"){
    var topic = activeEntity.uid;
    DB.child("topics/"+topic+"/questions/"+newQuestion.key).set(true);
  }
  DB.child("users/"+userUuid+"/questions/"+newQuestion.key).set("owner");

  showTopic(activeEntity.uid);
}