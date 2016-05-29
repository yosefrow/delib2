//create option
function createOption(title, description, explanation){

  if(description == "" || description == undefined){
    description = "";
  }
  if(explanation == "" || explanation == undefined){
    explanation = "";
  }

  if(title == "" || title == undefined){
    console.log("Eror: title = "+ title);
  } else {
    DB.child("options").push({title: title, description: description, explanation: explanation});
  }
}
