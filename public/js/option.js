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
