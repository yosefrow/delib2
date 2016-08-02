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


function setAcitveEntity (newEntity, newUid, newEventType, newCallback, turnOffFunction){
   console.log("in setAcitveEntity");


   var previuosEntity = activeEntity.entity;
   var previuosUid = activeEntity.uid;
   var previuosEventType = activeEntity.eventType;
   var previuosCallback = activeEntity.callback;
   var previuosTurnOffFunction = activeEntity.turnOffFunction;

   if (previuosEventType != ""){
      if (isNotEmpty(previuosUid)){
         console.log("turining off previous callback");
         DB.child(previuosEntity+"/"+previuosUid).off(previuosEventType, previuosCallback);
      } else {
         console.log("no previuos entity to close off previous callback");
      }
   } else {
      previuosTurnOffFunction();
      console.log("closing with function");
   }


   activeEntity.entity = newEntity;
   activeEntity.uid = newUid;
   activeEntity.eventType = newEventType;
   activeEntity.callback = newCallback;
   activeEntity.turnOffFunction = turnOffFunction;

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

function back(){
   var entity = activeEntity.entity;

   switch (entity){
      case "groups":
         showOwnedGroups();
         break;
      case "topics":
         showGroup(activeEntity.uid);
         break;
      case "questions":
         showTopic(activeEntity.uid);
      default:
         showOwnedGroups();
   }
}

function entityTypeToHebrew (entityType){
   switch (entityType){
      case "groups":
         return "קבוצה";
         break;
      case "topics":
         return "נושא";
         break;
      case "questions":
         return "שאלה";
         break;
      default:
         console.log("unknowen entity");
         return undefined;
   }
}


function setActiveEntity (entityType, uid, eventType, callback, turnOffFunction){
   console.log("entering active entity function");
   if (entityType != ""){
      var previousUid = activeEntity.uid;
      var previousEntityType = activeEntity.entity;
      var previousCallback = activeEntity.callback;
      var previousEventType = activeEntity.eventType;
      console.log("turn off previous entity: "+previousUid);
      //turn off old entity
      DB.child(previousEntityType+"/"+previousUid).off(previousEventType,previousCallback);
   } else {
      console.log("will try to turn off");
   }

   //set new active entity

   activeEntity.uid = uid;
   activeEntity.entity = entityType;
   activeEntity.callback = callback;
   activeEntity.eventType = eventType;
   console.log("setting to global new entity: "+activeEntity.uid);

}
