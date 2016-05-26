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
