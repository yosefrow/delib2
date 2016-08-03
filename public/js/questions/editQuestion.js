function editQuestion(questionUid){

   //intiate temp options object
   for (i=1;i<9;i++){
      optionsTempInput["option"+i]={title:"", description:""};
   }


   //bring data from DB
   DB.child("questions/"+questionUid).once("value", function(dataSnapshot){

      numberOfOptionsTemp = dataSnapshot.val().numberOfOptions;

      var questionTitle = dataSnapshot.val().title;
      var questionDescription = dataSnapshot.val().description;
      var typeOfQuestion = dataSnapshot.val().type;

      renderTemplate("#createQuestion-tmpl",{questionTitle: questionTitle, questionDescription:questionDescription}, "wrapper");
      renderTemplate("#editQuestionFooter-tmpl",{uuid:questionUid}, "footer")

      renderTemplate("#questionOptionsLimitedOptions-tmpl", {}, "#questionOptions");

      console.log(typeOfQuestion);
      $('input[type=radio][name=type]').val([typeOfQuestion]);

      switchBetweenTypesOfQuestions(typeOfQuestion, numberOfOptionsTemp);

      $('input[type=radio][name=type]').change(function(){

         var selcation = this.value;

         switchBetweenTypesOfQuestions(selcation, numberOfOptionsTemp);

      });

      //bring options from database

      DB.child("questions/"+questionUid+"/options").orderByChild("votes").limitToLast(8).once("value", function(optionsSnapshot){
         console.log("bring options from database "+ questionUid);
         console.dir(optionsSnapshot.val());
         var i=8;
         optionsSnapshot.forEach(function(optionData){
            optionsTempInput[optionData.key]={title:optionData.val().title, description:optionData.val().description};
            console.log(JSON.stringify(optionsTempInput["option"+i]));
            i--;
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
      alert("חסר שם שאלה");
      return;
   }

   if (userUuid == "" || userUuid == undefined) {
      alert("אנא התחבר/י למערכת");
      return;
   }

   console.dir(optionsTempInput);
   console.log("numberOfOptions "+numberOfOptionsTemp );

//   for (i=1;i<=numberOfOptionsTemp;i++){
//      if (optionsTempInput["option"+i].title == "") {
//         alert(" אופציה מספר "+i+" ריקה");
//         return;
//      }
//   }
//   for (i=numberOfOptionsTemp+1;i<9;i++){
//      if (optionsTempInput["option"+i].title == "") {
//         delete optionsTempInput["option"+i];
//      }
//
//
//   }

   console.dir(optionsTempInput);

   DB.child("questions/"+questionUid).update({title: title, description: description, type: type, numberOfOptions: numberOfOptionsTemp});

   for (i in optionsTempInput){
      //get new name and description
      var titleOption = $("#"+i+"_limitedOptions").val();
      var descriptionOption = $("#"+i+"_limitedOptionsDesc").val();
      console.log("title of "+i+" is: "+titleOption, descriptionOption);
      DB.child("questions/"+questionUid+"/options/"+i).update({title:titleOption, description:descriptionOption});
   }
   DB.child("questions/"+questionUid+"/options").update(optionsTempInput);

   showTopic(activeEntity.uid);
}

function switchBetweenTypesOfQuestions (typeOfQuestion, numberOfOptionsTemp){
   switch (typeOfQuestion) {
      case "forAgainst":
         renderTemplate("#questionOptionsForAgainst-tmpl", {}, "#questionOptions");
         break;
      case "limitedOptions":
         renderTemplate("#questionOptionsLimitedOptions-tmpl", {}, "#questionOptions");
         if(numberOfOptionsTemp>0){
            setNumberOfOptions(numberOfOptionsTemp);
         }
         break;
      default:
         $("#questionOptions").html("");
   }
}
