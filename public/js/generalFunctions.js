function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function parseDate(dateInMillisec){
  var d=new Date(dateInMillisec);

  var dayInMonth="0"+d.getDate();
  dayInMonth = dayInMonth.slice(-2);


  var month=d.getMonth();
  var monthsNames = ["ינואר", "פברואר", "מרץ", "ארפיל", "מאי", "יוני", "יולי", "אוג'", "ספט'", "אור'", "נוב'", "דצמ'"];
  month = monthsNames[month];

  var year=d.getYear()+1900;

  var minutes="0"+d.getMinutes();
  minutes = minutes.slice(-2);

  var hours="0"+d.getHours();
  hours = hours.slice(-2);

  var seconds="0"+d.getSeconds();
  seconds = seconds.slice(-2);

  return (year+"-"+month+"-"+dayInMonth+" - "+hours+":"+minutes+":"+seconds);

}


function goHome(){
  showPublicGroups();
  setAcitveEntity("","", "", "");
}

function setAcitveEntity (newEntity, newUid, newEventType, newCallback){
  var previuosEntity = activeEntity.entity;
  var previuosUid = activeEntity.uid;
  var previuosEventType = activeEntity.eventType;
  var previuosCallback = activeEntity.callback;

  console.log("hi: "+previuosEntity,previuosUid, previuosEventType, previuosCallback )

//  if(isNotEmpty(previuosUid)){
//
//    console.log()
//
//    if (previuosEventType != undefined || previuosEventType != ""){
//
//      DB.child(previuosEntity+"/"+previuosUid).off(previuosEventType, previuosCallback);
//    } else {
//      DB.child(previuosEntity+"/"+previuosUid).off();
//    }
//  }

  activeEntity.entity = newEntity;
  activeEntity.uid = newUid;
  activeEntity.eventType = newEventType;
  activeEntity.callback = newCallback;

  if (newUid != "" && newUid != undefined){
    DB.child(newEntity+"/"+newUid).once(newEventType, newCallback);
  }
}

function animateHeader(){
  $("header").hide();
  $("header").show(400);
}

function isNotEmpty(variable){
  if (variable != null || variable != undefined || variable != "" ){
    return true;
  } else {
    return false;
  }
}


