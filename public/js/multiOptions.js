function showMultiOptions(questionUid){
  //get options
  DB.child("questions/"+questionUid+"/options").once("value",function(options){
    $("wrapper").html("");

    options.forEach(function(option){
      var description = option.val().description;
      var title = option.val().title;
      var optionUid = option.key;
      var optionColor = option.val().color;

      DB.child("questions/"+questionUid+"/options/"+optionUid+"/thumbUp/"+userUuid).once("value", function(thumbUp){
        if (thumbUp.val()){
          $("#"+optionUid+"voteImg").attr("src", "img/thumbUpActive.png");
        } else {
          $("#"+optionUid+"voteImg").attr("src", "img/thumbUpInactive.png");
        }
      })

      appendTemplate("#multiOption-tmpl",{title:title, description: description, questionUid: questionUid, optionUid: optionUid, optionColor:optionColor }, "wrapper");
    })
  })


  //get new options
}

function voteUpOption(questionUid, optionUid){
  DB.child("questions/"+questionUid+"/options/"+optionUid+"/thumbUp/"+userUuid).once("value", function(thumbUp){
    if (thumbUp.val()){
      DB.child("questions/"+questionUid+"/options/"+optionUid+"/thumbUp/"+userUuid).set(false);
      $("#"+optionUid+"voteImg").attr("src", "img/thumbUpInactive.png");
    } else {
      DB.child("questions/"+questionUid+"/options/"+optionUid+"/thumbUp/"+userUuid).set(true);
      $("#"+optionUid+"voteImg").attr("src", "img/thumbUpActive.png");
    }
  })
}
