//create option
function createOption(questionUid, title, description, explanation){

  var color = getRandomColor();

  if(description == "" || description == undefined){
    description = "";
  }
  if(explanation == "" || explanation == undefined){
    explanation = "";
  }

  if(title == "" || title == undefined){
    console.log("Eror: title = "+ title);
  } else {
    DB.child("questions/"+questionUid+"/options").push({title: title, description: description, explanation: explanation, color:color});
  }
}

function openOptionMenu(optionUid){
  if ($("#optionMenu"+optionUid).is(":visible")){
    $("#optionMenu"+optionUid).hide(400);
  } else {
    $("#optionMenu"+optionUid).show(400);
  }

}

function editOption(questionUid, optionUid){

  DB.child("questions/"+questionUid+"/options/"+optionUid).once("value", function(dataSnapshot){
    var title = dataSnapshot.val().title;
    var description = dataSnapshot.val().description;
    $("#createMultiOptionName").val(title);
    $("#createMultiOptionDescription").text(description);
  })

  convertTemplate("#editMultiOptionFooter-tmpl", {questionUid:questionUid, optionUid: optionUid}, "footer");
  convertTemplate("#createMultiOption-tmpl", {}, "wrapper");
}

function editMultiOptionToDB (questionUid, optionUid){
  console.log("editMultiOptionToDB");

  var title =  $("#createMultiOptionName").val();
  var description = $("#createMultiOptionDescription").val();

  console.log(title, description);
  DB.child("questions/"+questionUid+"/options/"+optionUid).update({title: title, description:description});

  showMultiOptions(questionUid);
}
