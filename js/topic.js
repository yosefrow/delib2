//create new topic
function createNewTopic(title, description, explanation, imgTopic){

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
  if (imgTopic == undefined){
    imgTopic = "";
  };

  DB.child("topics").push({title: title, description: description, explanation: explanation, imgTopic: imgTopic});
}
