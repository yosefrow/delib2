function editQuestion(questionUid){

  //intiate temp options object
  for (i=1;i<9;i++){
    optionsTempInput["option"+i]={title:"", description:""};
  }


  //bring data from DB
  DB.child("questions/"+questionUid).once("value", function(dataSnapshot){

    numberOfOptionsTemp = dataSnapshot.val().numberOfOptions;


    var title = dataSnapshot.val().title;
    var description = dataSnapshot.val().description;
    console.log("Number of Options: "+ numberOfOptionsTemp, title, description);

    convertTemplate("#createQuestion-tmpl",{title: title, description:description}, "wrapper");
    convertTemplate("#editQuestionFooter-tmpl",{uuid:questionUid}, "footer")

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
      console.log("bring options from database "+ questionUid);
      console.dir(optionsSnapshot.val());
      var i=1;
      optionsSnapshot.forEach(function(optionData){
        optionsTempInput["option"+i]={title:optionData.val().title, description:optionData.val().description};
        console.log(JSON.stringify(optionsTempInput["option"+i]));
        i++;
      })
      setNumberOfOptions(numberOfOptionsTemp);
    });
  });
}

function updateQuestion(questionUid){
  //check if form exists...

  //get form info
  var title = $("#createQuestionName").val();
  var description = $("#createQuestionDescription").val();
  var type = $("input[name=type]:checked").val();
  console.log("name: " + title + ", Question description: "+ description + ", type: " + type);

  if (title == "") {
    alert("חסר שם קבוצה");
    return;
  }

  if (userUuid == "" || userUuid == undefined) {
    alert("אנא התחבר/י למערכת");
    return;
  }

  console.dir(optionsTempInput);
  for (i=1;i<9;i++){
    if (optionsTempInput["option"+i].title == ""){
      delete optionsTempInput["option"+i];
    }
  }
  console.dir(optionsTempInput);

  DB.child("questions/"+questionUid).update({title: title, description: description, type: type, numberOfOptions: numberOfOptionsTemp});
  DB.child("questions/"+questionUid+"/options").set(optionsTempInput);

  showTopic(activeEntity.uid);
}
